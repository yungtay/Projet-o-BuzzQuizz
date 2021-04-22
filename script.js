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
    const dados = resposta.data
    const pagina = document.querySelector(".conteudo-tela2")
    
    pagina.innerHTML = `
        <div class="topo-tela2">
            <img src="${dados.image}" alt="">
            <div class="titulo-quizzes-tela2">
                ${dados.title}
            </div>
        </div>
        <div class="perguntas-quizz">
        </div>`

    const perguntas = document.querySelector(".perguntas-quizz")
    dados.questions.forEach(pergunta => {
        perguntas.innerHTML += `
            <div class="pergunta-quizz">
                <div class="titulo-quizz-tela2" style="background-color:${pergunta.color};">
                    <span>${pergunta.title}</span> 
                </div>
                <div class="alternativas-respostas">
                </div>
            </div>`
        const respostas = document.querySelectorAll(".alternativas-respostas")
        pergunta.answers.forEach(resposta => {
            respostas[respostas.length - 1].innerHTML += `
                    <div class="alternativa" onclick="escolherResposta(this)" isCorrectAnswer="${resposta.isCorrectAnswer}">
                        <img src="${resposta.image}" alt="">
                        <span class="resposta">${resposta.text}</span> 
                    </div>`
        });
    });

    perguntas.innerHTML += `
    <div class="resultado-acertos escondido">
        <div class="titulo-acertos">
            <span>${porcentagem}% de acerto: ${dados.levels[0].title}</span> 
        </div>
        <div class="imagemEDescricaoAcerto">
            <img src="${dados.levels[0].image}" alt="">
            <span class="descricao-acerto">
                ${dados.levels[0].text}
            </span>
        </div>
    </div>
    <div class="finalDoQuizz escondido">
    <button class="reiniciarQuizz" onclick="">Reiniciar Quizz</button>
        <button class="voltarHome" onclick="acessarQuizz()">Voltar pra home</button>
    </div>
    `
    acessarQuizz()
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
    } else{
        fimQuizz()
    }
}

function fimQuizz(){
    porcentagem = (acertos/tentativas)*100;
    const resultado = document.querySelector(".resultado-acertos")
    const botoesFinalQuizz = document.querySelector(".finalDoQuizz")
    resultado.classList.toggle("escondido")
    botoesFinalQuizz.classList.toggle("escondido")
    resultado.scrollIntoView({block: "center", behavior: "smooth"})
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

    if(pai.querySelector("input:first-child").value.length < 65 && pai.querySelector("input:first-child").value.length > 2/*20*/){
        modeloQuizz.title = pai.querySelector("input:first-child").value;
    }else{
        //alert("Título não válido");
        console.log("Título não válido");
    }
    
    if(/*cirar o teste de URL aqui e retornar true ou false testeURL(pai.querySelector("input:nth-child(2)").value)*/
        pai.querySelector("input:nth-child(2)").value !== ""){
        modeloQuizz.image = pai.querySelector("input:nth-child(2)").value;
    }else{
        //alert("URL não válida");
        console.log("URL não válida");
    }

    if(pai.querySelector("input:nth-child(3)").value > 2){
        modeloQuizz.question.length = pai.querySelector("input:nth-child(3)").value;
    }else{
        //alert("Número de questões não válido");
        console.log("Número de questões não válido");
    }


    if(pai.querySelector("input:last-child").value > 1){
        modeloQuizz.level.length = pai.querySelector("input:last-child").value;
    }else{
        //alert("Número de níveis não válido");
        console.log("Número de níveis não válido");
    }


    if(modeloQuizz.title !== "" && modeloQuizz.image !== "" && modeloQuizz.question.length > 2 && modeloQuizz.level.length > 1){
        popularPerguntas();
        pai.querySelector("input:first-child").value = "";
        pai.querySelector("input:nth-child(2)").value = "";
        pai.querySelector("input:nth-child(3)").value = "";
        pai.querySelector("input:last-child").value = "";
    }
}

function popularPerguntas(){
    const esconderTela = document.querySelector(".comeca-pelo-comeco");
    const mostrarTela = document.querySelector(".criar-perguntas");
    esconderTela.classList.add("escondido");
    mostrarTela.classList.remove("escondido");

    mostrarTela.innerHTML = `
        <div class="texto">
            <strong>
                Crie suas perguntas
            </strong>
        </div>
    `;

    for (let i = 0; i < modeloQuizz.question.length; i++) {
        mostrarTela.innerHTML += `
            <div class="pergunta-fechada" onclick="abrirPergunta(this)">
                <span>
                    <strong>
                        Pergunta ${i+1}
                    </strong>
                </span>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            
            <div class="perguntas escondido">
                <span class="pergunta-texto">
                    <strong>
                        Pergunta ${i+1}
                    </strong>
                </span>
                <div class="pergunta-criar-quizz">
                    <input type="text" placeholder="Texto da pergunta">
                    <input type="text" placeholder="Cor de fundo da pergunta">
                </div>
                <span class="pergunta-texto">
                    <strong>
                        Resposta correta
                    </strong>
                </span>
                <div class="resposta-criar-quizz">
                    <input type="text" placeholder="Resposta correta">
                    <input type="text" placeholder="URL da imagem">
                </div>
                <span class="pergunta-texto">
                    <strong>
                        Respostas incorretas
                    </strong>
                </span>
                <div class="primeira-resposta-incorreta">
                    <input type="text" placeholder="Respostas incorretas 1">
                    <input type="text" placeholder="URL da imagem 1">
                </div>
                <div class="segunda-resposta-incorreta">
                    <input type="text" placeholder="Respostas incorretas 2">
                    <input type="text" placeholder="URL da imagem 2">
                </div>
                <div class="terceira-resposta-incorreta">
                    <input type="text" placeholder="Respostas incorretas 3">
                    <input type="text" placeholder="URL da imagem 3">
                </div>
            </div>
        `;
    }
    mostrarTela.innerHTML += `
    <input class="botao-perguntas" onclick="formatarRespostas(this)" type="button" value="Prosseguir pra criar níveis">
    `;
}

function abrirPergunta(elemento){
    const pai = elemento.parentNode;
    const perguntaEscondida = elemento.nextElementSibling;
    const esconderPerguntaAberta = pai.querySelector(".pergunta-fechada.escondido");

    if(pai.querySelector(".pergunta-fechada.escondido") !== null){

        elemento.classList.add("escondido");
        perguntaEscondida.classList.remove("escondido");

        esconderPerguntaAberta.classList.remove("escondido");
        esconderPerguntaAberta.nextElementSibling.classList.add("escondido");

    }else{

        elemento.classList.add("escondido");
        perguntaEscondida.classList.remove("escondido");
    }    
}

function formatarRespostas(elemento){
    const todasAsPerguntas = Array.from(elemento.parentNode.querySelectorAll('.perguntas'));
    const perguntas = {title: "", color: "", answers: []};
    let respostas = {text: "", image: "", isCorrectAnswer: Boolean};

    for (let i = 0; i < todasAsPerguntas.length; i++) {
        const perguntaPrincipal = todasAsPerguntas[i].querySelector(".pergunta-criar-quizz");

        if(perguntaPrincipal.querySelector("input:first-child").value.length > 1/*9*/){
            perguntas.title = perguntaPrincipal.querySelector("input:first-child").value;
        }else{
            //alert("Título da pergunta " + (i+1) + " não aceito");
            console.log("Título da pergunta " + (i+1) + " não aceito");
        }

        if(/* FAZER TESTE testeHexadecimal(perguntaPrincipal.querySelector("input:last-child").value)*/ true){
            perguntas.title = perguntaPrincipal.querySelector("input:last-child").value;
        }else{
            //alert("Cor de fundo da pergunta " + (i+1) + " não aceito");
            console.log("Cor de fundo da pergunta " + (i+1) + " não aceito");
        }

        const respostaPrincipal = todasAsPerguntas[i].querySelector(".resposta-criar-quizz");

        if(respostaPrincipal.querySelector("input:first-child").value !== "" /*&& testeURL(respostaPrincipal.querySelector("input:last-child").value)*/){
            respostas.text = respostaPrincipal.querySelector("input:first-child").value;
            respostas.image = respostaPrincipal.querySelector("input:last-child").value;
            respostas.isCorrectAnswer = true;
            perguntas.answers.push(respostas);
            respostas = {text: "", image: "", isCorrectAnswer: Boolean};
        }else{
            //alert("Resposta correta não aceita");
            console.log("Resposta correta não aceita");
        }

        const primeiraRespostaErrada = todasAsPerguntas[i].querySelector(".primeira-resposta-incorreta");

        if(primeiraRespostaErrada.querySelector("input:first-child").value !== "" /*&& testeURL(primeiraRespostaErrada.querySelector("input:last-child").value)*/){
            respostas.text = primeiraRespostaErrada.querySelector("input:first-child").value;
            respostas.image = primeiraRespostaErrada.querySelector("input:last-child").value;
            respostas.isCorrectAnswer = false;
            perguntas.answers.push(respostas);
            respostas = {text: "", image: "", isCorrectAnswer: Boolean};
        }else{
            //alert("Primeira resposta errada da pergunta " + (i+1) + " não aceita");
            console.log("Primeira resposta errada da pergunta " + (i+1) + " não aceita");
        }

        console.log(perguntas);

        /*const segundaRespostaErrada = todasAsPerguntas[i].querySelector(".segunda-resposta-incorreta");
        console.log(segundaRespostaErrada.querySelector("input:first-child").value);
        console.log(segundaRespostaErrada.querySelector("input:last-child").value);

        const terceiraRespostaErrada = todasAsPerguntas[i].querySelector(".terceira-resposta-incorreta");
        console.log(terceiraRespostaErrada.querySelector("input:first-child").value);
        console.log(terceiraRespostaErrada.querySelector("input:last-child").value);*/
    }
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
