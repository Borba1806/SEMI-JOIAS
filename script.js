function adicionarProduto() {
  const nome = document.getElementById('nome').value;
  const valor = document.getElementById('valor').value;
  const descricao = document.getElementById('descricao').value;
  const imagem = document.getElementById('imagem').value;

  if (!nome || !valor || !descricao || !imagem) {
    alert("Preencha todos os campos!");
    return;
  }

  const produto = { nome, valor, descricao, imagem };
  let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  produtos.push(produto);
  localStorage.setItem('produtos', JSON.stringify(produtos));

  carregarCatalogo();

  // Limpar campos
  document.getElementById('nome').value = '';
  document.getElementById('valor').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('imagem').value = '';
}

function carregarCatalogo() {
  const catalogo = document.getElementById('catalogo');
  if (!catalogo) return;

  catalogo.innerHTML = '';
  let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

  produtos.forEach(p => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <h3>${p.nome}</h3>
      <p><strong>R$ ${p.valor}</strong></p>
      <p>${p.descricao}</p>
    `;
    catalogo.appendChild(div);
  });
}
