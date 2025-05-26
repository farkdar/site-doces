async function carregarProdutos(categoria, containerId, arquivoJson) {
  try {
    const response = await fetch(arquivoJson);
    const data = await response.json();
    const produtos = data.items;

    const container = document.getElementById(containerId);
    produtos.forEach(produto => {
      const card = document.createElement("div");
      card.className = "card-flip";

      // Verifica se há lista de sabores
      let saboresHtml = "";
      if (produto.sabores && produto.sabores.length > 0) {
        saboresHtml = `
          <h3>Sabores</h3>
          <ul class="lista-sabores-1">
            ${produto.sabores.map(sabor => `<li>${sabor}</li>`).join("")}
          </ul>`;
      }

      card.innerHTML = `
        <div class="card-front">
          <img src="${produto.image}" alt="${produto.title}">
          <h3>${produto.title}</h3>
          <p>R$ ${produto.preco}</p>
        </div>
        <div class="card-back">
          <h3>Composição</h3>
          <p>${produto.descricao}</p>
          ${saboresHtml}
          <button class="botao-pedir" onclick="adicionarAoCarrinho('${produto.title}', ${produto.preco.replace(',', '.')})">
            Carrinho
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
