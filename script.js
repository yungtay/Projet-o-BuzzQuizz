const tela1 = document.querySelector(".conteudo-tela1")
const tela2 = document.querySelector(".conteudo-tela2")
const tela3 = document.querySelector(".conteudo-tela3")
const carregar = document.querySelector(".tela-carregar")
const modeloQuizz = {title:"", image:"", questions:[], levels:[]};

let quizzes
let respostaEscolhida;
let respostaCerta;
let respostasErradas;


let dadosQuizzAtual = []
let tentativas = 0;
let acertos = 0;
let porcentagem = 0;
let flagFimQuizz;

chamarDados();
function chamarDados() {
    const promessa = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes")
    carregar.classList.toggle("escondido")
    promessa.then(captarQuizzes)
    promessa.catch()
}

function captarQuizzes(resposta){
    const dados = resposta.data
    console.log(dados);
    quizzes = [dados]
    popularQuizzes()
}

function popularQuizzes(){
    const ulTodosQuizzes = document.querySelector(".ul-todos-quizzes")
    const ulSeusQuizzes = document.querySelector(".ul-seus-quizzes")
    const criarQuizz = document.querySelector(".criar-quizzes")
    let idQuizzesSeus = localStorage.getItem("ids");
    idQuizzesSeus = JSON.parse(idQuizzesSeus)
    
    ulTodosQuizzes.innerHTML = "";
    ulSeusQuizzes.innerHTML = "";
    quizzes[0].forEach(li => {
        if( idQuizzesSeus !== null && idQuizzesSeus.includes(li.id)){
            ulSeusQuizzes.parentElement.classList.remove("escondido")
            criarQuizz.classList.add("escondido")
            ulSeusQuizzes.innerHTML += `
            <li onclick="carregarQuizz(${li.id})">
                <img src="${li.image}" alt="">
                <div class="titulo-il-quizzes">
                    ${li.title}
                </div>
            </li>`
        } else {
            ulTodosQuizzes.innerHTML += `
            <li onclick="carregarQuizz(${li.id})">
                <img src="${li.image}" alt="">
                <div class="titulo-il-quizzes">
                    ${li.title}
                </div>
            </li>`
        }
    });
    carregar.classList.toggle("escondido")
}

function acessarQuizz(){
    if(tela3.classList.contains("escondido")){
        tela1.classList.toggle("escondido")
        tela2.classList.toggle("escondido")
    } else {
        tela3.classList.add("escondido")
        tela2.classList.remove("escondido")
    }
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
    carregar.classList.toggle("escondido")
    promessa.then(paginaQuizz)
    promessa.catch()
}

function paginaQuizz(resposta){
    flagFimQuizz = 0
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
        pergunta.answers.sort(p => Math.random() - 0.5).forEach(resposta => {
            respostas[respostas.length - 1].innerHTML += `
                    <div class="alternativa" onclick="escolherResposta(this)" isCorrectAnswer="${resposta.isCorrectAnswer}">
                        <img src="${resposta.image}" alt="">
                        <div class="resposta">${resposta.text}</div> 
                    </div>`
        });
    });
    if(tela2.classList.contains("escondido")){
        acessarQuizz()
    }
    carregar.classList.add("escondido")
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
}

function correcao(todasAlternativas){
    respostaCerta = []
    respostasErradas = []
    todasAlternativas.forEach(comparaResposta)
    if (respostaEscolhida === respostaCerta[0]){ acertos += 1}
    tentativas += 1;
    setTimeout(scrollar, 2000)
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
    } else if (tentativas === pergunta.length && flagFimQuizz === 0){
        fimQuizz()
    }
}

function fimQuizz(){
    flagFimQuizz = 1;
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
    dadosAgrupados.sort((a,b) => b - 0)
    const nivel = dadosAgrupados.find(element => element <= porcentagem)
    return dadosAgrupadosOriginal.indexOf(nivel)


}

function verificandoPerguntas(elemento){
    const pai = elemento.previousElementSibling;
    const lista = pai.querySelectorAll("input");

    if(pai.querySelector("input:first-child").value.length > 19){
        modeloQuizz.title = pai.querySelector("input:first-child").value;
    }else{
        alert("Título não válido");
    }
    
    if(testeUrl(pai.querySelector("input:nth-child(2)").value) &&
        pai.querySelector("input:nth-child(2)").value !== ""){

        modeloQuizz.image = pai.querySelector("input:nth-child(2)").value;
    }else{
        alert("URL não válida");
    }

    if(pai.querySelector("input:nth-child(3)").value > 2){
        modeloQuizz.questions.length = pai.querySelector("input:nth-child(3)").value;
    }else{
        alert("Número de questões não válido");
    }


    if(pai.querySelector("input:last-child").value > 1){
        modeloQuizz.levels.length = pai.querySelector("input:last-child").value;
    }else{
        alert("Número de níveis não válido");
    }


    if(modeloQuizz.title !== "" && modeloQuizz.image !== "" && modeloQuizz.questions.length > 2 && modeloQuizz.levels.length > 1){
        popularPerguntas();
        zerarValores(pai);
    }
}

function zerarValores(elemento) {
    for(let i = 1; i < 5; i++){
        elemento.querySelector("input:nth-child(" + i + ")").value = "";
    }
}

function popularPerguntas(){
    const esconderTela = document.querySelector(".comeca-pelo-comeco");
    const mostrarTela = document.querySelector(".criar-perguntas");
    esconder(esconderTela, mostrarTela);

    mostrarTela.innerHTML = `
        <div class="texto">
            <strong>
                Crie suas perguntas
            </strong>
        </div>
    `;

    for (let i = 0; i < modeloQuizz.questions.length; i++) {
        mostrarTela.innerHTML += `
            <div class="pergunta-fechada" onclick="abrirElemento(this)">
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
                    <input type="text" placeholder="Texto da pergunta" minlength="20">
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
    <input class="botao-perguntas" onclick="verificandoRespostas(this)" type="button" value="Prosseguir pra criar níveis">
    `;
}

function abrirElemento(elemento){
    const pai = elemento.parentNode;
    const elementoEscondido = elemento.nextElementSibling;
    const esconderElementoAberto = pai.querySelector(".pergunta-fechada.escondido");

    if(pai.querySelector(".pergunta-fechada.escondido") !== null){
        esconder(elemento, elementoEscondido);
        esconder(esconderElementoAberto.nextElementSibling, esconderElementoAberto);
    }else{
        esconder(elemento, elementoEscondido);
    }
}

function verificandoRespostas(elemento){
    const todasAsPerguntas = Array.from(elemento.parentNode.querySelectorAll('.perguntas'));
    let perguntas = {title: "", color: "", answers: []};
    let respostas = {text: "", image: "", isCorrectAnswer: Boolean};
    let autorizado = true;

    function tornarFalso() {
        autorizado = false;
        pushAutorizado = false;
    }

    for (let i = 0; i < todasAsPerguntas.length; i++) {
        let pushAutorizado = true;
        const perguntaPrincipal = todasAsPerguntas[i].querySelector(".pergunta-criar-quizz");

        if(perguntaPrincipal.querySelector("input:first-child").value.length > 19){
            perguntas.title = perguntaPrincipal.querySelector("input:first-child").value;
        }else{
            alert("Título da pergunta " + (i+1) + " não aceito");
            tornarFalso();
        }

        if(testeHexadecimal(perguntaPrincipal.querySelector("input:last-child").value)){
            perguntas.color = perguntaPrincipal.querySelector("input:last-child").value;
        }else{
            alert("Cor de fundo da pergunta " + (i+1) + " não aceito");
            tornarFalso();
        }

        const respostaPrincipal = todasAsPerguntas[i].querySelector(".resposta-criar-quizz");

        if(respostaPrincipal.querySelector("input:first-child").value !== "" && testeUrl(respostaPrincipal.querySelector("input:last-child").value)){
            respostas.text = respostaPrincipal.querySelector("input:first-child").value;
            respostas.image = respostaPrincipal.querySelector("input:last-child").value;
            respostas.isCorrectAnswer = true;
            perguntas.answers.push(respostas);
            respostas = {text: "", image: "", isCorrectAnswer: Boolean};
        }else{
            alert("Resposta correta da pergunta " + (i+1) + " não aceita");
            tornarFalso();
        }

        const primeiraRespostaErrada = todasAsPerguntas[i].querySelector(".primeira-resposta-incorreta");

        if(primeiraRespostaErrada.querySelector("input:first-child").value !== "" && testeUrl(primeiraRespostaErrada.querySelector("input:last-child").value)){
            respostas.text = primeiraRespostaErrada.querySelector("input:first-child").value;
            respostas.image = primeiraRespostaErrada.querySelector("input:last-child").value;
            respostas.isCorrectAnswer = false;
            perguntas.answers.push(respostas);
            respostas = {text: "", image: "", isCorrectAnswer: Boolean};
        }else{
            alert("Primeira resposta incorreta da pergunta " + (i+1) + " não aceita");
            tornarFalso();
        }

        const segundaRespostaErrada = todasAsPerguntas[i].querySelector(".segunda-resposta-incorreta");

        if(segundaRespostaErrada.querySelector("input:first-child").value !== "" || segundaRespostaErrada.querySelector("input:last-child").value !== ""){
            if(segundaRespostaErrada.querySelector("input:first-child").value !== "" && segundaRespostaErrada.querySelector("input:last-child").value !== ""){
                if(testeUrl(segundaRespostaErrada.querySelector("input:last-child").value)){
                    respostas.text = segundaRespostaErrada.querySelector("input:first-child").value;
                    respostas.image = segundaRespostaErrada.querySelector("input:last-child").value;
                    respostas.isCorrectAnswer = false;
                    perguntas.answers.push(respostas);
                    respostas = {text: "", image: "", isCorrectAnswer: Boolean};
                }else{
                    alert("Segunda resposta incorreta da pergunta " + (i+1) + " não válida");
                    tornarFalso();
                }
            }else{
                alert("Segunda resposta incorreta da pergunta " + (i+1) + " incompleta");
                tornarFalso();
            }
        }

        const terceiraRespostaErrada = todasAsPerguntas[i].querySelector(".terceira-resposta-incorreta");

        if(terceiraRespostaErrada.querySelector("input:first-child").value !== "" || terceiraRespostaErrada.querySelector("input:last-child").value !== ""){
            if(terceiraRespostaErrada.querySelector("input:first-child").value !== "" && terceiraRespostaErrada.querySelector("input:last-child").value !== ""){
                if(testeUrl(terceiraRespostaErrada.querySelector("input:last-child").value)){
                    respostas.text = terceiraRespostaErrada.querySelector("input:first-child").value;
                    respostas.image = terceiraRespostaErrada.querySelector("input:last-child").value;
                    respostas.isCorrectAnswer = false;
                    perguntas.answers.push(respostas);
                    respostas = {text: "", image: "", isCorrectAnswer: Boolean};
                }else{
                    alert("Terceira resposta incorreta da pergunta " + (i+1) + " não válida");
                    tornarFalso();
                }
            }else{
                alert("Terceira resposta incorreta da pergunta " + (i+1) + " incompleta");
                tornarFalso();
            }
        }

        if(pushAutorizado){
            modeloQuizz.questions[i] = perguntas;
            perguntas = {title: "", color: "", answers: []};  
        }
          
    }

    if(autorizado){
        popularNiveis();
    }
}

function popularNiveis(){
    const esconderTela = document.querySelector(".criar-perguntas");
    const mostrarTela = document.querySelector(".escolha-niveis");
    esconder(esconderTela,mostrarTela);

    mostrarTela.innerHTML = `
        <div class="texto">
            <strong>
                Agora, decida os níveis
            </strong>
        </div>
    `;

    for (let i = 0; i < modeloQuizz.levels.length; i++) {
        mostrarTela.innerHTML += `
            <div class="pergunta-fechada" onclick="abrirElemento(this)">
                <span class="pergunta-texto">
                    <strong>
                        Nível ${i+1}
                    </strong>
                </span>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class="perguntas escondido">
                <span class="pergunta-texto">
                    <strong>
                        Nível ${i+1}
                    </strong>
                </span>
                <div class="resposta-nivel">
                    <input type="text" placeholder="Título do nível" minlength="10">
                    <input type="text" placeholder="% de acerto mínima">
                    <input type="text" placeholder="URL da imagem do nível">
                    <input type="text" placeholder="Descrição do nível">
                    <textarea placeholder="Descrição do nível" minlength="30" cols="30" rows="10"></textarea>
                </div>
            </div>
        `;
    }

    mostrarTela.innerHTML += `
        <input class="botao-perguntas" onclick="validarNivel(this)" type="button" value="Finalizar quizz">
    `;
}

function validarNivel(elemento) {
    const todosOsNiveis = Array.from(elemento.parentNode.querySelectorAll(".perguntas"));
    let niveis = {title: "", image: "", text: "", minValue: "" };
    let autorizado = true;
    let possuiZero = false;
    function receberFalso() {
        autorizado = false;
        nivelAutorizado = false;
    }

    for (let i = 0; i < modeloQuizz.levels.length; i++) {
        let nivelAutorizado = true;
        if(todosOsNiveis[i].querySelector(".resposta-nivel input:first-child").value.length > 9){
            niveis.title = todosOsNiveis[i].querySelector(".resposta-nivel input:first-child").value;
        }else{
            alert("Título do Nível " + (i+1) + " é inválido");
            receberFalso();
        }
        
        if(todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(2)").value >= 0 && todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(2)").value <= 100){
            niveis.minValue = todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(2)").value;
            if(todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(2)").value === "0"){
                possuiZero = true;
            }
        }else{
            alert("Valor do nível " + (i+1) + " é inválido");
            receberFalso();   
        }

        if(testeUrl(todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(3)").value)){
            niveis.image = todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(3)").value;
        }else{
            alert("Imagem do nível " + (i+1) + " é inválido");
            receberFalso();   
        }

        if (todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(4)").value === "") {
            if(todosOsNiveis[i].querySelector(".resposta-nivel textarea").value !== "" && todosOsNiveis[i].querySelector(".resposta-nivel textarea").value.length > 29){
                niveis.text = todosOsNiveis[i].querySelector(".resposta-nivel textarea").value;
            }else{
                alert("Descrição do nível " + (i+1) + " é inválido");
                receberFalso();
            }
            
        }else{
            if(todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(4)").value.length > 29){
                niveis.text = todosOsNiveis[i].querySelector(".resposta-nivel input:nth-child(4)").value;
            }else{
                alert("Descrição do nível " + (i+1) + " é inválido");
                receberFalso(); 
            }
        }

        if(nivelAutorizado){
            modeloQuizz.levels[i] = niveis;
            niveis = {title: "", image: "", text: "", minValue: "" };
        }

        if(!possuiZero){
            console.log("Precisa ter algum nível com minimo 0")
        }
    }

    if (autorizado === true && possuiZero === true) {
        const promessa = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes", modeloQuizz);
        promessa.then(adicionaLocalStorage);
        promessa.catch(deuRuim);
    }

}

function adicionaLocalStorage(id){
    let idsDeserializados = [];
    const idsSerializadosEntrada = localStorage.getItem("ids")
    if(idsSerializadosEntrada !== null){
        idsDeserializados = JSON.parse(idsSerializadosEntrada);
    }
    idsDeserializados.push(id.data.id);
    const idsSerializadosSaida = JSON.stringify(idsDeserializados);
    localStorage.setItem("ids", idsSerializadosSaida)

    finalizarQuizz(id.data.id);
}

function deuRuim(valor){
    console.log("Chorou!!");
}

function finalizarQuizz(id){
    const esconderTela = document.querySelector(".escolha-niveis");
    const mostrarTela = document.querySelector(".quizz-pronto");
    esconder(esconderTela,mostrarTela);

    chamarDados();
    
    mostrarTela.innerHTML = `
        <div class="texto">
            <strong>
                Seu quizz está pronto!
            </strong>
        </div>
        <div class="previa-quizz" onclick="carregarQuizz(${id})">
            <img src="${modeloQuizz.image}" alt="">
            <div class="titulo-previa-quizz">
                ${modeloQuizz.title}
            </div>
        </div>
        <input class="botao-finalizado" onclick="carregarQuizz(${id})" type="button" value="Acessar Quizz">
        <input class="botao-voltar-home" onclick="paginaPrincipal()" type="button" value="Voltar pra home">
    `;
}

function paginaPrincipal(){
    const alterarCriacao = document.querySelector(".quizz-pronto");
    const mostrarPassoCriacao = document.querySelector(".comeca-pelo-comeco");

    esconder(tela3,tela1);
    esconder(alterarCriacao,mostrarPassoCriacao);
}

function testeHexadecimal(hexa){
    if (hexa[0] === '#') {
        const hexasNum = hexa.substr(1);
        if(hexasNum.length === 6 && !isNaN(Number('0x' + hexasNum))){
            return true;
        }
    }else{
        return false;
    }
}
    

function testeUrl(url){
    let padraoUrl = new RegExp('^(https?:\\/\\/)?'+
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
    '((\\d{1,3}\\.){3}\\d{1,3}))'+
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
    '(\\?[;&a-z\\d%_.~+=-]*)?'+
    '(\\#[-a-z\\d_]*)?$','i');
  return !!padraoUrl.test(url);
}

function esconder(adicionar, remover) {
    adicionar.classList.add("escondido");
    remover.classList.remove("escondido");
}

