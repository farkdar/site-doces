const carrinho = [];

// Carrega o carrinho salvo do localStorage, se existir

const carrinhoSalvo = localStorage.getItem("carrinhoFlorido");
if (carrinhoSalvo) {
    carrinho.push(...JSON.parse(carrinhoSalvo));
    atualizarCarrinho();
}


function mostrarToast() {
    const toast = document.getElementById("toast-adicionado");
    if (!toast) {
        console.warn("Elemento #toast-adicionado não encontrado.");
        return;
    }
    toast.classList.add("toast-visivel");
    setTimeout(() => {
        toast.classList.remove("toast-visivel");
    }, 2000);
}


function adicionarAoCarrinho(produto, preco = 0, categoria = "") {
    const existente = carrinho.find(item => item.nome === produto && item.categoria === categoria);
    if (existente) {
        existente.qtd += 1;
    } else {
        carrinho.push({
            nome: produto,
            qtd: 1,
            preco: parseFloat(preco),
            categoria: categoria
        });
    }
    atualizarCarrinho();
    salvarCarrinho();
    mostrarToast();
}


function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    lista.innerHTML = "";

    let total = 0;
    let totalItens = 0;

    // Agrupar por categoria
    const agrupado = {};

    carrinho.forEach((item, index) => {
        total += item.qtd * item.preco;
        totalItens += item.qtd;

        if (!agrupado[item.categoria]) {
            agrupado[item.categoria] = [];
        }
        agrupado[item.categoria].push({ ...item, index });
    });

    // Gerar elementos por categoria
    for (const categoria in agrupado) {
        const items = agrupado[categoria];
        const precoTotalCategoria = items.reduce((acc, i) => acc + i.qtd * i.preco, 0);

        const titulo = document.createElement("h4");
        titulo.style.margin = "10px 0 4px";
        titulo.textContent = `${categoria} R$${precoTotalCategoria.toFixed(2).replace(".", ",")}`;
        lista.appendChild(titulo);

        items.forEach(({ nome, qtd, index }) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div style="display: flex; align-items: center; gap: 5px;">
                    <button onclick="event.stopPropagation(); alterarQtd(${index}, -1)">−</button>
                    <strong>${qtd}</strong>
                    <button onclick="event.stopPropagation(); alterarQtd(${index}, 1)">+</button>
                    <span>${nome}</span>
                </div>
                <button onclick="event.stopPropagation(); removerDoCarrinho(${index})" style="margin-left: 7px;">✕</button>
            `;
            lista.appendChild(li);
        });
    }

    document.getElementById("total-preco").textContent = total.toFixed(2).replace(".", ",");
    document.getElementById("total-itens").textContent = totalItens;
}


function alterarQtd(index, delta) {
    carrinho[index].qtd += delta;
    if (carrinho[index].qtd <= 0) {
        carrinho.splice(index, 1); // Remove se zerar
    }
    atualizarCarrinho();
    salvarCarrinho();
}


function enviarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const agrupado = {};
  let total = 0;

  carrinho.forEach(item => {
    total += item.qtd * item.preco;
    const cat = item.categoria || "Outros";
    if (!agrupado[cat]) agrupado[cat] = [];
    agrupado[cat].push(item);
  });

  let mensagem = "Olá! Quero fazer um pedido:\n\n";

  for (const categoria in agrupado) {
    // pular categorias com "doce" no nome
    if (categoria.toLowerCase().includes("doce")) continue;

    mensagem += `*${categoria}*\n`;
    agrupado[categoria].forEach(item => {
      mensagem += `• ${item.qtd}x ${item.nome}\n`;
    });
    mensagem += `\n`;
  }

  mensagem += `*Total: R$ ${total.toFixed(2).replace(".", ",")}*`;

  const url = `https://wa.me/554497302139?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");

  carrinho.length = 0;
  salvarCarrinho();
  atualizarCarrinho();

  setTimeout(() => {
    window.location.href = "agradecimento.html";
  }, 500);
}



function toggleCarrinho() {
    const container = document.getElementById("carrinho-container");
    container.classList.toggle("visivel");
    container.classList.toggle("oculto");
}

// Fecha o carrinho ao clicar fora
document.addEventListener("click", function (event) {
    const carrinho = document.getElementById("carrinho-container");
    const botao = document.getElementById("abrir-carrinho");

    // Fecha o carrinho apenas se o clique foi fora dele e fora do botão
    if (
        carrinho.classList.contains("visivel") &&
        !event.target.closest("#carrinho-container") &&
        !event.target.closest("#abrir-carrinho")
    ) {
        carrinho.classList.remove("visivel");
        carrinho.classList.add("oculto");
    }
});



function salvarCarrinho() {
    localStorage.setItem("carrinhoFlorido", JSON.stringify(carrinho));
}


function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
    salvarCarrinho();
}