const tela1 = document.querySelector(".conteudo-tela1")
const tela2 = document.querySelector(".conteudo-tela2")
const tela3 = document.querySelector(".conteudo-tela3")
let respostaEscolhida;
let respostaCerta;
let respostasErradas;
let tentativas = 0;
let acertos = 0;

let teste;

function acessarQuizz(){
    tela1.classList.toggle("escondido")
    tela2.classList.toggle("escondido")
}

function criarQuizz(){
    tela1.classList.add("escondido");
    tela3.classList.remove("escondido");
}

function escolherResposta(ele){
    teste = ele.nextElementSibling
    if (ele.classList.contains("esbranquicado") || ele === respostaEscolhida){
        return
    }

    const todasAlternativas = Array.from(ele.parentNode.children) 
    todasAlternativas.forEach(alt => {
        alt.classList.add("esbranquicado")
    });
    ele.classList.remove("esbranquicado")
    respostaEscolhida = ele
    correcao(todasAlternativas)
    setTimeout(scrollar, 2000)
    
}

function correcao(todasAlternativas){
    respostaCerta = []
    respostasErradas = []
    todasAlternativas.forEach(comparaResposta)
    if (respostaEscolhida === respostaCerta[0]){ acertos += 1}
    tentativas += 1;
    respostaCerta[0].classList.add("correto")
    respostasErradas.forEach(alt => {
        alt.classList.add("errado")
    });
    
}

function comparaResposta(alternativa){
    if(alternativa === alternativa){
        respostaCerta.push(alternativa)
    } else {
        respostasErradas.push(alternativa)
    }  
}

function scrollar(){
    const pergunta = document.querySelectorAll(".pergunta-quizz")
    if(tentativas < pergunta.length){
        pergunta[tentativas].scrollIntoView({block: "center", behavior: "smooth"})
    }
}

function abrirPergunta(elemento){
    const perguntaEscondida = elemento.nextElementSibling;
    elemento.classList.add("escondido");
    perguntaEscondida.classList.remove("escondido");
    const pai = elemento.parentNode;

    const esconderPerguntaAberta = pai.querySelector(".pergunta-fechada, escondido");
    console.log(esconderPerguntaAberta);
    esconderPerguntaAberta.classList.remove("escondido");
    esconderPerguntaAberta.nextElementSibling.classList.add("escondido");

    //Mano, não sei pq não ta abrindo na segunda vez, aqui e na próxima função. Separei em duas pra fazer melhor mas da pra refatorar.
}

function abrirNivel(elemento){
    const nivelEscondido = elemento.nextElementSibling;
    elemento.classList.add("escondido");
    nivelEscondido.classList.remove("escondido");
    const pai = elemento.parentNode;

    const esconderNivelAberto = pai.querySelector(".pergunta-fechada, escondido");
    console.log(esconderNivelAberto);
    esconderNivelAberto.classList.remove("escondido");
    esconderNivelAberto.nextElementSibling.classList.add("escondido");
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
    const alterarCriacao = document.querySelector(".quizz-pronto");
    const mostrarPassoCriacao = document.querySelector(".comeca-pelo-comeco");
    
    tela1.classList.remove("escondido");
    tela3.classList.add("escondido");
    alterarCriacao.classList.add("escondido");
    mostrarPassoCriacao.classList.remove("escondido");
}
