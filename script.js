const tela1 = document.querySelector(".conteudo-tela1")
const tela2 = document.querySelector(".conteudo-tela2")
const tela3 = document.querySelector(".conteudo-tela3")
const modeloQuizz = {title:"", image:"", question:[], level:[]};

const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes")
promessa.then(captarQuizzes)
promessa.catch()

let quizzes
let respostaEscolhida;
let respostaCerta;
let respostasErradas;


let dadosQuizzAtual = []
let tentativas = 0;
let acertos = 0;
let porcentagem = 0;


function captarQuizzes(resposta){
    const dados = resposta.data
    quizzes = [dados]
    popularQuizzes()
}

function popularQuizzes(){
    const ul = document.querySelector(".ul-todos-quizzes")
    quizzes[0].forEach(li => {
        ul.innerHTML += `
            <li onclick="carregarQuizz(${li.id})">
                <img src="${li.image}" alt="">
                <div class="titulo-il-quizzes">
                    ${li.title}
                </div>
            </li>`
    });
}

function acessarQuizz(){
    tela1.classList.toggle("escondido")
    tela2.classList.toggle("escondido")
    window.scroll({
        top: 0,
        left: 0,
     });
}

function criarQuizz(){
    tela1.classList.toggle("escondido")
    tela3.classList.toggle("escondido")
}

function carregarQuizz(id){
    const promessa = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}`)
    promessa.then(paginaQuizz)
    promessa.catch()
}

function paginaQuizz(resposta){
    tentativas = 0;
    acertos = 0;
    porcentagem = 0;
    dadosQuizzAtual = resposta
    const pagina = document.querySelector(".conteudo-tela2")
    
    pagina.innerHTML = `
        <div class="topo-tela2">
            <img src="${dadosQuizzAtual.data.image}" alt="">
            <div class="titulo-quizzes-tela2">
                ${dadosQuizzAtual.data.title}
            </div>
        </div>
        <div class="perguntas-quizz">
        </div>`

    const perguntas = document.querySelector(".perguntas-quizz")
    dadosQuizzAtual.data.questions.forEach(pergunta => {
        perguntas.innerHTML += `
            <div class="pergunta-quizz">
                <div class="titulo-quizz-tela2" style="background-color:${pergunta.color};">
                    <span>${pergunta.title}</span> 
                </div>
                <div class="alternativas-respostas">
                </div>
            </div>`
        const respostas = document.querySelectorAll(".alternativas-respostas")
        pergunta.answers.sort(aleatorio).forEach(resposta => {
            respostas[respostas.length - 1].innerHTML += `
                    <div class="alternativa" onclick="escolherResposta(this)" isCorrectAnswer="${resposta.isCorrectAnswer}">
                        <img src="${resposta.image}" alt="">
                        <span class="resposta">${resposta.text}</span> 
                    </div>`
        });
    });
    if(tela2.classList.contains("escondido")){
        acessarQuizz()
    }
    
}

function escolherResposta(ele){
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
    if(alternativa.getAttribute("isCorrectAnswer") === "true"){
        respostaCerta.push(alternativa)
    } else {
        respostasErradas.push(alternativa)
    }  
}

function scrollar(){
    const pergunta = document.querySelectorAll(".pergunta-quizz")
    if(tentativas < pergunta.length){
        pergunta[tentativas].scrollIntoView({block: "center", behavior: "smooth"})
        console.log("Menor")
    } else if (tentativas === pergunta.length){
        console.log("Maior")
        fimQuizz()
    }
}

function fimQuizz(){
    porcentagem = Math.round((acertos/tentativas)*100);
    const nivel = nivelAtingido(porcentagem)
    const perguntas = document.querySelector(".perguntas-quizz")
    perguntas.innerHTML += `
    <div class="resultado-acertos escondido">
        <div class="titulo-acertos">
            <span>${porcentagem}% de acerto: ${dadosQuizzAtual.data.levels[nivel].title}</span> 
        </div>
        <div class="imagemEDescricaoAcerto">
            <img src="${dadosQuizzAtual.data.levels[nivel].image}" alt="">
            <span class="descricao-acerto">
                ${dadosQuizzAtual.data.levels[nivel].text}
            </span>
        </div>
    </div>
    <div class="finalDoQuizz escondido">
    <button class="reiniciarQuizz" onclick="reiniciar()">Reiniciar Quizz</button>
        <button class="voltarHome" onclick="acessarQuizz()">Voltar pra home</button>
    </div>
    `
    const resultado = document.querySelector(".resultado-acertos")
    const botoesFinalQuizz = document.querySelector(".finalDoQuizz")
    resultado.classList.toggle("escondido")
    botoesFinalQuizz.classList.toggle("escondido")
    resultado.scrollIntoView({block: "center", behavior: "smooth"})
}

function reiniciar(){
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
     });
    paginaQuizz(dadosQuizzAtual)

}

function nivelAtingido(porcentagem){
    const dadosAgrupados = []
    const dadosAgrupadosOriginal = []
    dadosQuizzAtual.data.levels.forEach(element => {
        dadosAgrupados.push(element["minValue"])
        dadosAgrupadosOriginal.push(element["minValue"])
    });
    dadosAgrupados.sort(numeroDescrescentes)
    const nivel = dadosAgrupados.find(element => element <= porcentagem)
    return dadosAgrupadosOriginal.indexOf(nivel)


}

function abrirPergunta(elemento){
    const perguntaEscondida = elemento.nextElementSibling;
    elemento.classList.add("escondido");
    perguntaEscondida.classList.remove("escondido");
    console.log(perguntaEscondida);

    const pai = elemento.parentNode;
    console.log(pai);

    const esconderPerguntaAberta = pai.querySelector(".pergunta-fechada, .escondido");
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

function formatarPerguntas(elemento){
    const pai = elemento.previousElementSibling;

    modeloQuizz.title = pai.querySelector("input:first-child").value;
    modeloQuizz.image = pai.querySelector("input:nth-child(2)").value;
    modeloQuizz.question.length = pai.querySelector("input:nth-child(3)").value;
    modeloQuizz.level.length = pai.querySelector("input:last-child").value;

    /*if(pai.querySelector("input:first-child").value.length < 65 && pai.querySelector("input:first-child").value.length > 20){
        modeloQuizz.title = pai.querySelector("input:first-child").value;
    }
    //PUXAR O TESTE DA URL AQUI modeloQuizz.image = pai.querySelector("input:nth-child(2)").value;
    if(pai.querySelector("input:nth-child(3)").value > 2){
        modeloQuizz.question.length = pai.querySelector("input:nth-child(3)").value;
    }
    if(pai.querySelector("input:last-child").value > 1){
        modeloQuizz.level.length = pai.querySelector("input:last-child").value;
    }*/
    
    console.log(modeloQuizz);
    pai.querySelector("input:first-child").value = "";
    pai.querySelector("input:nth-child(2)").value = "";
    pai.querySelector("input:nth-child(3)").value = "";
    pai.querySelector("input:last-child").value = "";

    //criei o objeto e populei com qualquer coisa, por enquanto. Falta fazer as verificações.
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

function numeroDescrescentes(a, b) {
    return b - a;
}

function aleatorio() { 
	return Math.random() - 0.5; 
}
