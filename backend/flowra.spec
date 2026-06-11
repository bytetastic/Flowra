# -*- mode: python ; coding: utf-8 -*-
from PyInstaller.utils.hooks import collect_data_files, collect_submodules
import os

frontend_build = os.path.join('..', 'frontend', 'build')

a = Analysis(
    ['main_desktop.py'],
    pathex=['.'],
    binaries=[],
    datas=[
        (frontend_build, 'frontend_build'),
        *collect_data_files('webview'),
    ],
    hiddenimports=[
        *collect_submodules('uvicorn'),
        *collect_submodules('fastapi'),
        *collect_submodules('webview'),
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.protocols',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'anyio',
        'anyio._backends._asyncio',
        'sqlite3',
    ],
    excludes=['tkinter', 'matplotlib', 'numpy', 'pandas', 'pytest'],
    noarchive=False,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='Flowra',
    debug=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,        # Kein schwarzes Konsolenfenster im Hintergrund
    icon='assets/icon.ico',
)