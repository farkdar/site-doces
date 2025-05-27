async function carregarCategoriasEProdutos() {
  try {
    const resposta = await fetch("produtos/categorias.json");
    const dados = await resposta.json();

    const categoriasOrdenadas = dados.categorias.sort((a, b) => a.ordem - b.ordem);

    for (const categoria of categoriasOrdenadas) {
      const { id, titulo, json } = categoria;

      // Cria a seção no HTML
      const secao = document.createElement("section");
      secao.id = id;
      secao.innerHTML = `
        <h2>${titulo}</h2>
        <p class="aviso-scroll">Arraste para o lado 👉</p>
        <div class="produtos-container" id="container-${id}"></div>
      `;
      document.getElementById("produtos-dinamicos").appendChild(secao);

      // Carrega os produtos da categoria
      await carregarProdutos(id, `container-${id}`, json);
    }
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);
  }
}

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

document.addEventListener("DOMContentLoaded", carregarCategoriasEProdutos);
