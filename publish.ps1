# Script de Publicação para o GitHub
# Este script conecta seu repositório local ao repositório remoto e envia o código.

Write-Host "Configurando a branch principal como 'main'..." -ForegroundColor Cyan
git branch -M main

Write-Host "Adicionando o repositório remoto..." -ForegroundColor Cyan
# Tenta remover o remote origin caso já exista para evitar erros
git remote remove origin 2> $null
git remote add origin https://github.com/maryreginaf15/lista-de-tarefas.git

Write-Host "Enviando os arquivos para o GitHub (git push)..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Projeto publicado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao publicar o projeto. Verifique suas credenciais do GitHub ou se o repositório remoto está correto." -ForegroundColor Red
}
