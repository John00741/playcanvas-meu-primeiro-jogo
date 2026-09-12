# Meu Primeiro Projeto - PlayCanvas

Repositório de scripts do projeto PlayCanvas "Meu primeiro projeto" (jogo de bola rolante).

Os arquivos em `scripts/` são carregados no editor do PlayCanvas como **External Scripts**,
apontando para a versão publicada via jsDelivr:

```
https://cdn.jsdelivr.net/gh/John00741/playcanvas-meu-primeiro-jogo@main/scripts/<arquivo>.js
```

## Scripts

- `follow-camera.js` — controla a câmera que segue a bola
- `movement.js` — controla o movimento da bola (WASD / setas), pulo/double jump (Espaço) e teleporte ao cair
- `teleporter.js` — dispara o teleporte quando a bola entra no volume de trigger
- `lava-flow.js` — anima a textura do material de lava (scroll + pulso de brilho), preso à entidade "Lava"
