"""
auth.py — Autentikasi dan Autorisasi
Menangani login, JWT token, dan pengecekan role user.
"""

import os
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from database import get_connection

# Konfigurasi JWT
SECRET_KEY = os.getenv("JWT_SECRET", "nilai-siswa-secret-key-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTP Bearer token scheme
security = HTTPBearer()


def hash_password(password: str) -> str:
    """
    Hash password menggunakan bcrypt.
    
    Args:
        password (str): Password plain text
        
    Returns:
        str: Password yang sudah di-hash
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifikasi password dengan hash-nya.
    
    Args:
        plain_password (str): Password plain text
        hashed_password (str): Password yang sudah di-hash
        
    Returns:
        bool: True jika password cocok
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Buat JWT access token.
    
    Args:
        data (dict): Data yang akan disimpan di token
        expires_delta (timedelta, optional): Waktu kadaluarsa
        
    Returns:
        str: JWT token string
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode JWT token.
    
    Args:
        token (str): JWT token string
        
    Returns:
        dict: Data dari token
        
    Raises:
        HTTPException: Jika token tidak valid
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid atau sudah kadaluarsa",
        )


def authenticate_user(username: str, password: str) -> Optional[dict]:
    """
    Autentikasi user berdasarkan username dan password.
    
    Args:
        username (str): Username
        password (str): Password plain text
        
    Returns:
        dict: Data user jika berhasil, None jika gagal
    """
    conn = get_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE username = ?", (username,)
    ).fetchone()
    conn.close()
    
    if user is None:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    
    return dict(user)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Dependency: Ambil data user dari JWT token di header Authorization.
    
    Args:
        credentials: HTTP Bearer token dari header
        
    Returns:
        dict: Data user yang sedang login
        
    Raises:
        HTTPException: Jika token tidak valid atau user tidak ditemukan
    """
    token = credentials.credentials
    payload = decode_token(token)
    
    username = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    
    conn = get_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE username = ?", (username,)
    ).fetchone()
    conn.close()
    
    if user is None:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    
    return dict(user)


def require_role(*roles):
    """
    Dependency factory: Batasi akses berdasarkan role.
    
    Args:
        *roles: Role yang diizinkan ('admin', 'guru', 'siswa')
        
    Returns:
        function: Dependency checker
    """
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Akses ditolak. Role yang diizinkan: {', '.join(roles)}",
            )
        return current_user
    return role_checker
