# Checklist de Teste - Calculadora Lavar Roupa

## ✅ Funcionalidades Testadas

### 1. Seleção de Categorias
- [ ] Clique na aba "Brancas" carrega produtos brancos
- [ ] Clique na aba "Pretas" carrega produtos pretos
- [ ] Clique na aba "Coloridas" carrega produtos coloridos
- [ ] Clique na aba "Toalhas" carrega produtos toalhas
- [ ] Clique na aba "Cama" carrega produtos cama
- [ ] Clique na aba "Edredom" carrega produtos edredom
- [ ] Tab ativa tem gradiente pink
- [ ] Transição suave entre categorias

### 2. Toggle de Tamanho (½ / Máquina Cheia)
- [ ] Botão "½ Máquina" começa ativo
- [ ] Clique em "Máquina Cheia" ativa o botão
- [ ] Quantidades dos produtos aumentam 2x (half → full)
- [ ] Botão ativo tem gradiente pink
- [ ] Hover mostra feedback visual

### 3. Slider de Quantidade
- [ ] Deslizar para esquerda = "Normal (1x)"
- [ ] Meio do slider = "Mais cheia (1.5x)"
- [ ] Deslizar para direita = "Bem cheia (2x)"
- [ ] Rótulo atualiza dinamicamente ao mover
- [ ] Multiplicadores mostram abaixo (1x | 1.5x | 2x)
- [ ] Produtos reescalam corretamente com multiplicador
- [ ] Thumb do slider tem efeito hover (cresce)
- [ ] Sombra ao redor do slider é visível

### 4. Display de Produtos
- [ ] Cada produto mostra emoji grande
- [ ] Quantidade base é exibida em tamanho grande
- [ ] Multiplicador (×1.5) aparece como badge
- [ ] Nome do produto está claro
- [ ] Nota informativa aparece abaixo
- [ ] Cards têm sombra subtil
- [ ] Hover eleva o card e adiciona brilho
- [ ] Linha superior animada ao hover

### 5. Pinho Sol / Lisoforme
- [ ] Aparece em Brancas (½ tampinha / 1 tampinha)
- [ ] Aparece em Pretas (½ tampinha / 1 tampinha)
- [ ] Aparece em Coloridas (½ tampinha / 1 tampinha)
- [ ] Aparece em Toalhas (½ tampinha / 1 tampinha)
- [ ] Aparece em Cama (½ tampinha / 1 tampinha)
- [ ] Aparece em Edredom (¼ tampinha / ½ tampinha)
- [ ] Nota diz "no compartimento pré-lavagem"
- [ ] Descrição é específica por categoria

### 6. Temperatura & Dicas
- [ ] Badge de temperatura aparece
- [ ] Cor muda por tipo (hot/warm/cold)
- [ ] Dica (calc-tip) aparece abaixo
- [ ] Ícone de dica tem fundo suave
- [ ] Texto de dica é legível

### 7. Design Premium
- [ ] Header tem gradiente luxuoso
- [ ] Cards têm sombras profundas
- [ ] Cores são harmoniosas (pinks, earth tones)
- [ ] Tipografia é clara e hierarquizada
- [ ] Espaçamento é gerado (padding, gaps)
- [ ] Transições são suaves (0.35s cubic-bezier)
- [ ] Nenhum elemento "apertado"

### 8. Responsividade
- [ ] Desktop (1200px+): Grid 4 colunas
- [ ] Tablet (700px): Grid 2 colunas
- [ ] Mobile (480px): Grid 1 coluna
- [ ] Slider permanece acessível em mobile
- [ ] Botões têm tamanho adequado para toque
- [ ] Texto não fica ilegível

### 9. Interatividade
- [ ] Cliques registram corretamente
- [ ] Slider responde ao drag
- [ ] Hover effects funcionam
- [ ] Nenhum lag visual
- [ ] Transições completam suavemente

### 10. Validações de Conteúdo
- [ ] Nenhum erro de sintaxe JavaScript
- [ ] Arquivo index.html valida
- [ ] Arquivo app.js compila
- [ ] CSS não tem conflitos
- [ ] Imagens/ícones carregam (emojis)

---

## 🎯 Testes Sugeridos (Passo-a-Passo)

### Teste 1: Fluxo Completo
1. Abra index.html
2. Veja se em Brancas, calcLoad=half, slider=1
3. Mude para "Máquina Cheia" → quantidades dobram
4. Mova o slider para 1.5x → quantidades × 1.5
5. Mude de categoria (Pretas) → muda corretamente
6. Verifique Pinho Sol em cada categoria

### Teste 2: Validar Pinho Sol
1. Vá a cada categoria (brancas, pretas, coloridas, toalhas, cama, edredom)
2. Em cada uma, procure por "Pinho Sol" ou "Lisoforme"
3. Verifique nota diz "no compartimento pré-lavagem"
4. Confirme que muda com toggle ½/Cheia
5. Confirme que responde ao slider

### Teste 3: Responsividade
1. Desktop: Veja 4 colunas de produtos
2. Redimensione para 700px: Veja 2 colunas
3. Redimensione para 480px: Veja 1 coluna
4. Verifique slider sempre funciona
5. Verifique texto é sempre legível

---

**Notas:**
- Este é um projeto vanilla JavaScript (sem frameworks)
- Todos os dados estão no app.js (sem API)
- CSS está em styles.css com design system completo
- Design é "tapeçoso" (premium, luxuoso)

