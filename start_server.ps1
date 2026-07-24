$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
} catch {
    Write-Host "No se pudo iniciar el servidor en el puerto $port. Es posible que ya esté en uso o que requiera permisos de administrador."
    Write-Host "Error: $_"
    Exit
}

Write-Host "============================================="
Write-Host "Servidor local iniciado exitosamente."
Write-Host "Dirección: http://localhost:$port/"
Write-Host "Presiona Ctrl+C en esta terminal para apagarlo."
Write-Host "============================================="

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        $urlPath = [uri]::UnescapeDataString($urlPath)
        
        # Combinar la ruta local. Nos aseguramos de quitar cualquier barra inicial extra.
        $cleanPath = $urlPath.TrimStart('/')
        if ($cleanPath -eq "") {
            $localPath = Join-Path (Get-Location) "index.html"
        } else {
            $localPath = Join-Path (Get-Location) $cleanPath
        }

        # Si apunta a un directorio, buscar index.html dentro de él
        if (Test-Path $localPath -PathType Container) {
            $localPath = Join-Path $localPath "index.html"
        }

        if (Test-Path $localPath -PathType Leaf) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($localPath)
                $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
                
                # Mapear tipos MIME comunes
                $contentType = "text/html"
                switch ($ext) {
                    ".css" { $contentType = "text/css" }
                    ".js" { $contentType = "application/javascript" }
                    ".png" { $contentType = "image/png" }
                    ".jpg" { $contentType = "image/jpeg" }
                    ".jpeg" { $contentType = "image/jpeg" }
                    ".gif" { $contentType = "image/gif" }
                    ".svg" { $contentType = "image/svg+xml" }
                    ".ico" { $contentType = "image/x-icon" }
                    ".json" { $contentType = "application/json" }
                }
                
                # Añadir encabezado charset para html/css/js
                if ($contentType -match "text" -or $contentType -eq "application/javascript") {
                    $response.ContentType = "$contentType; charset=utf-8"
                } else {
                    $response.ContentType = $contentType
                }

                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                Write-Host "[200] $urlPath"
            } catch {
                $response.StatusCode = 500
                $buffer = [System.Text.Encoding]::UTF8.GetBytes("Error interno del servidor (500): $_")
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                Write-Host "[500] $urlPath - $_"
            }
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 No Encontrado: la ruta '$urlPath' no existe en este servidor.")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            Write-Host "[404] $urlPath"
        }
        $response.OutputStream.Close()
    }
} catch {
    Write-Host "El servidor se detuvo: $_"
} finally {
    $listener.Stop()
}
