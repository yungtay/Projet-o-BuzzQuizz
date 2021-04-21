function acessarQuizz(){
//Esconder tela 1 e acessar tela 2
}

function criarQuizz(){
    const esconderTela = document.querySelector(".conteudo-tela1");
    const mostrarTela = document.querySelector(".conteudo-tela3");
    esconderTela.classList.add("escondido");
    mostrarTela.classList.remove("escondido");

}

function criarPerguntas(){
    const esconderTela = document.querySelector(".comeca-pelo-comeco");
    const mostrarTela = document.querySelector(".criar-perguntas");
    esconderTela.classList.add("escondido");
    mostrarTela.classList.remove("escondido");
}

function criarNiveis(){
    const esconderTela = document.querySelector(".criar-perguntas");
    const mostrarTela = document.querySelector(".escolha-niveis");
    esconderTela.classList.add("escondido");
    mostrarTela.classList.remove("escondido");
}

function finalizarQuizz(){
    const esconderTela = document.querySelector(".escolha-niveis");
    const mostrarTela = document.querySelector(".quizz-pronto");
    esconderTela.classList.add("escondido");
    mostrarTela.classList.remove("escondido");
}

function paginaPrincipal(){
    const mostrarTelaPrincipal = document.querySelector(".conteudo-tela1");
    const esconderTelaAtual = document.querySelector(".conteudo-tela3");
    const alterarCriacao = document.querySelector(".quizz-pronto");
    const mostrarPassoCriacao = document.querySelector(".comeca-pelo-comeco");
    
    mostrarTelaPrincipal.classList.remove("escondido");
    esconderTelaAtual.classList.add("escondido");
    alterarCriacao.classList.add("escondido");
    mostrarPassoCriacao.classList.remove("escondido");
}