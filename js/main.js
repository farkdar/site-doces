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


        function adicionarAoCarrinho(produto, preco = 0) {
            const existente = carrinho.find(item => item.nome === produto);
            if (existente) {
                existente.qtd += 1;
            } else {
                carrinho.push({ nome: produto, qtd: 1, preco: parseFloat(preco) });
            }
            atualizarCarrinho();
            salvarCarrinho();
            console.log("Chamando toast");
            mostrarToast();
        }

        function atualizarCarrinho() {
            const lista = document.getElementById("lista-carrinho");
            lista.innerHTML = "";

            let total = 0;
            let totalItens = 0;

            carrinho.forEach((item, index) => {
                total += item.qtd * item.preco;
                totalItens += item.qtd;

                const li = document.createElement("li");
                li.innerHTML = `
                <div style="display: flex; align-items: center; gap: 5px;">
                    <button onclick="alterarQtd(${index}, -1)">−</button>
                    <strong>${item.qtd}</strong>
                    <button onclick="alterarQtd(${index}, 1)">+</button>
                    <span>${item.nome}</span>
                </div>
                <button onclick="removerDoCarrinho(${index})" style="margin-left: 7px;">✕</button>
                `;

                lista.appendChild(li);
            });

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

            const mensagem = carrinho
                .map(item => `• ${item.qtd}x ${item.nome}`)
                .join("%0A");

            const texto = `Olá! Quero fazer um pedido:%0A${mensagem}`;
            const url = `https://wa.me/554497302139?text=${texto}`;

            // Abre o WhatsApp
            window.open(url, "_blank");

            // Limpa o carrinho e redireciona
            carrinho.length = 0; // esvazia o array
            salvarCarrinho();    // atualiza o localStorage
            atualizarCarrinho(); // atualiza a interface

            // Redireciona após pequeno delay
            setTimeout(() => {
                window.location.href = "agradecimento.html";
            }, 500); // meio segundo (ajustável)
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

            if (
                carrinho.classList.contains("visivel") &&
                !carrinho.contains(event.target) &&
                !botao.contains(event.target)
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
