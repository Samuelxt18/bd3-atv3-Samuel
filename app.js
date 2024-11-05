/* Renderização da lista de dados */
const listAluno = document.querySelector('#aluno-list');

function renderList(doc) {
    let aluno = document.createElement('li'); // Use <li> para melhor semântica
    let nome_aluno = document.createElement('span');
    let cpf = document.createElement('span');
    let rg = document.createElement('span');
    let tel_aluno = document.createElement('span');
    let tel_responsavel = document.createElement('span');
    let email = document.createElement('span');
    let data_nascimento = document.createElement('span');
    let exclusao = document.createElement('button');

    aluno.setAttribute('data-id', doc.id);

    nome_aluno.textContent = doc.data().nome_aluno || 'Nome não disponível';
    cpf.textContent = doc.data().cpf || 'CPF não disponível';
    rg.textContent = doc.data().rg || 'RG não disponível';
    tel_aluno.textContent = doc.data().tel_aluno || 'Telefone não disponível';
    tel_responsavel.textContent = doc.data().tel_responsavel || 'Tel. Responsável não disponível';
    email.textContent = doc.data().email || 'Email não disponível';

    const nascimento = doc.data().data_nascimento;
    if (nascimento) {
        const dateObj = new Date(nascimento);
        data_nascimento.textContent = dateObj.toLocaleDateString(); // Formata a data
    } else {
        data_nascimento.textContent = 'N/A';
    }

    // Adicione isso ao seu código existente

// Seleciona o botão de excluir e o campo de entrada
const btnExcluirAluno = document.querySelector('#btn-excluir-aluno');
const inputNomeExcluir = document.querySelector('#nome-aluno-excluir');

// Função para excluir aluno pelo nome
btnExcluirAluno.addEventListener('click', () => {
    const nomeParaExcluir = inputNomeExcluir.value.trim();
    
    if (nomeParaExcluir) {
        // Busca o aluno pelo nome
        db.collection('BD3-NoSQL-Firestore')
            .where('nome_aluno', '==', nomeParaExcluir)
            .get()
            .then((snapshot) => {
                if (snapshot.empty) {
                    console.log("Nenhum aluno encontrado com esse nome.");
                    return;
                }
                
                // Exclui todos os documentos que correspondem ao nome
                snapshot.forEach(doc => {
                    db.collection('BD3-NoSQL-Firestore').doc(doc.id).delete()
                        .then(() => {
                            console.log("Aluno excluído com sucesso:", nomeParaExcluir);
                            // Remove o item da lista (opcional)
                            const alunoLi = document.querySelector(`[data-id="${doc.id}"]`);
                            if (alunoLi) alunoLi.remove();
                        })
                        .catch((error) => {
                            console.error("Erro ao excluir o aluno:", error);
                        });
                });
            })
            .catch((error) => {
                console.error("Erro ao buscar alunos:", error);
            });
    } else {
        console.log("Por favor, insira um nome de aluno.");
    }
});


    aluno.appendChild(nome_aluno);
    aluno.appendChild(cpf);
    aluno.appendChild(rg);
    aluno.appendChild(tel_aluno);
    aluno.appendChild(tel_responsavel);
    aluno.appendChild(email);
    aluno.appendChild(data_nascimento);
    aluno.appendChild(exclusao); // Adiciona o botão de exclusão ao item

    listAluno.appendChild(aluno);
}

// Carregar os documentos do Firestore
db.collection('BD3-NoSQL-Firestore')
    .get()
    .then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderList(doc); // Passa o documento completo
        });
    })
    .catch((error) => {
        console.error("Erro ao recuperar documentos:", error);
    });

/* Inserção de dados */
const form = document.querySelector('#add-aluno-form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    db.collection('BD3-NoSQL-Firestore').add({
        nome_aluno: form.nome_aluno.value,
        cpf: form.cpf.value,
        rg: form.rg.value,
        tel_aluno: form.tel_aluno.value,
        tel_responsavel: form.tel_responsavel.value,
        email: form.email.value,
        data_nascimento: form.data_nascimento.value
    }).then(() => {
        form.reset(); // Limpa o formulário
        window.location.reload(); // Recarrega a página para mostrar os novos dados
    }).catch((error) => {
        console.error("Erro ao adicionar aluno:", error);
    });
});
