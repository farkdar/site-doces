async function carregarProdutos(categoria, containerId, arquivoJson) {
  try {
    const response = await fetch(arquivoJson);
    const data = await response.json();
    const produtos = data.items;

    const container = document.getElementById(containerId);
    produtos.forEach(produto => {
      const isNovo = produto.novo === true ? '<span class="selo-novo">NOVO</span>' : '';

      const saboresHTML = Array.isArray(produto.sabores) && produto.sabores.length > 0
        ? `
          <h3>Sabores</h3>
          <ul class="lista-sabores-1">
            ${produto.sabores.map(sabor => `<li>${sabor}</li>`).join('')}
          </ul>
        `
        : '';

      const card = document.createElement("div");
      card.className = "card-flip";
      card.innerHTML = `
        <div class="card-front">
          ${isNovo}
          <img src="${produto.image}" alt="${produto.title}">
          <h3>${produto.title}</h3>
          <p>R$ ${produto.preco}</p>
        </div>
        <div class="card-back">
          <h3>Composição</h3>
          <p>${produto.descricao}</p>
          ${saboresHTML}
          <button class="botao-pedir" onclick="adicionarAoCarrinho('${produto.title}', ${produto.preco.replace(',', '.')}, '${categoria}')">
            Adicionar
          </button>
        </div>
      `;
      card.onclick = () => card.classList.toggle("flipped");
      container.appendChild(card);
    });
  } catch (erro) {
    console.error(`Erro ao carregar ${categoria}:`, erro);
  }
}
