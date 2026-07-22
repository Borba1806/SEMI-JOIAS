const form = document.getElementById("produtoForm");
const listaProdutos = document.getElementById("listaProdutos");

let produtos =
JSON.parse(localStorage.getItem("produtos")) || [];

function salvarProdutos(){
localStorage.setItem(
"produtos",
JSON.stringify(produtos)
);
}

function renderizarProdutos(){

if(!listaProdutos) return;

listaProdutos.innerHTML = "";

produtos.forEach(produto => {

const card = document.createElement("div");

card.classList.add("produto-card");

card.innerHTML = `

<img src="${produto.imagem}" alt="${produto.nome}">

<div class="produto-info">

<h3>${produto.nome}</h3>

<p class="preco">
R$ ${Number(produto.preco).toFixed(2)}
</p>

<p>
${produto.descricao}
</p>

<a
class="btn-compra"
target="_blank"
href="https://wa.me/5500000000000?text=Olá,%20tenho%20interesse%20em%20${produto.nome}">
Solicitar Compra
</a>

</div>

`;

listaProdutos.appendChild(card);

});

}

if(form){

form.addEventListener("submit",(e)=>{

e.preventDefault();

const produto = {

nome: document.getElementById("nome").value,

preco: document.getElementById("preco").value,

imagem: document.getElementById("imagem").value,

descricao: document.getElementById("descricao").value

};

produtos.push(produto);

salvarProdutos();

renderizarProdutos();

form.reset();

});

}

renderizarProdutos();