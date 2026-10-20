const bancoDeVerbos = [
  { kanji: "行く", leitura: "いく", traducao: "Ir", raiz: "行き", temImagem: true },
  { kanji: "帰る", leitura: "かえる", traducao: "Voltar", raiz: "帰り", temImagem: true },
  { kanji: "飲む", leitura: "のむ", traducao: "Beber", raiz: "飲み", temImagem: true },
  { kanji: "買う", leitura: "かう", traducao: "Comprar", raiz: "買い", temImagem: true },
  { kanji: "聞く", leitura: "きく", traducao: "Ouvir / Perguntar", raiz: "聞き", temImagem: true },
  { kanji: "話す", leitura: "はなす", traducao: "Falar", raiz: "話し", temImagem: true },
  { kanji: "読む", leitura: "よむ", traducao: "Ler", raiz: "読み", temImagem: true },
  { kanji: "書く", leitura: "かく", traducao: "Escrever", raiz: "書き", temImagem: true },
  { kanji: "会う", leitura: "あう", traducao: "Encontrar", raiz: "会い", temImagem: true },
  { kanji: "待つ", leitura: "まつ", traducao: "Esperar", raiz: "待ち", temImagem: true },
  { kanji: "食べる", leitura: "たべる", traducao: "Comer", raiz: "食べ", temImagem: true },
  { kanji: "見る", leitura: "みる", traducao: "Ver / Assistir", raiz: "見", temImagem: true },
  { kanji: "起きる", leitura: "おきる", traducao: "Acordar", raiz: "起き", temImagem: true },
  { kanji: "寝る", leitura: "ねる", traducao: "Dormir", raiz: "寝", temImagem: true },
  { kanji: "教える", leitura: "おしえる", traducao: "Ensinar", raiz: "教え", temImagem: true },
  { kanji: "来る", leitura: "くる", traducao: "Vir", raiz: "来", temImagem: false }
];

const temposVerbais = [
  { nome: "Presente / Futuro", correto: "ます" },
  { nome: "Interrogativo", correto: "ますか" },
  { nome: "Negativo", correto: "ません" },
  { nome: "Passado", correto: "ました" },
  { nome: "Passado Interrogativo", correto: "ましたか" },
  { nome: "Passado Negativo", correto: "ませんでした" }
];

const todosSufixos = ["ます", "ますか", "ません", "ました", "ましたか", "ませんでした"];

let totalQuestoes = 16;
let questaoAtualIndex = 0;
let acertosCount = 0;
let errosCount = 0;
let nomeAluno = "";

let verbosEmbaralhados = []; // Fila sequencial sem repetição
let verboAtual = {};
let tempoAtual = {};
let sufixoSelecionado = "";
let tentativasErros = 0;

// URL do Google Apps Script
const URL_GOOGLE_SCRIPT = "https://script.google.com/macros/s/AKfycbxdzM4rVow4PlLhbbCF3Me0F9RVPCneqF_kz9JGrIZvLu3XHn76tNOiXRLzr_0tbRRL/exec";

function iniciarPraticaComNome() {
  const input = document.getElementById("input-nome");
  nomeAluno = input.value.trim();

  if (nomeAluno === "") {
    alert("Por favor, digite o seu nome antes de iniciar!");
    return;
  }

  // Embaralha a lista de verbos sem repetir nenhum
  verbosEmbaralhados = [...bancoDeVerbos].sort(() => Math.random() - 0.5);

  document.getElementById("etapa-nome").style.display = "none";
  carregarQuestao();
}

function carregarQuestao() {
  if (questaoAtualIndex >= totalQuestoes) {
    mostrarTelaFim();
    return;
  }

  document.getElementById("mensagem").innerText = "";
  document.getElementById("mensagem").className = "mensagem";
  document.getElementById("explicacao").innerText = "";
  document.getElementById("btn-proximo").style.display = "none";
  document.getElementById("btn-conferir").style.display = "inline-block";
  sufixoSelecionado = "";
  tentativasErros = 0;

  // Pega o verbo da vez da lista embaralhada (garante 16 únicos)
  verboAtual = verbosEmbaralhados[questaoAtualIndex];
  
  // Sorteia um tempo verbal aleatório para esse verbo
  tempoAtual = temposVerbais[Math.floor(Math.random() * temposVerbais.length)];

  if (!verboAtual.temImagem) {
    iniciarEtapa2();
    return;
  }

  document.getElementById("etapa1").style.display = "block";
  document.getElementById("etapa2").style.display = "none";
  document.getElementById("tela-fim").style.display = "none";

  document.getElementById("img-verbo").src = `img/${verboAtual.kanji}.png`;
  document.getElementById("traducao-etapa1").innerText = verboAtual.traducao;

  const containerOpcoes = document.getElementById("opcoes-etapa1");
  containerOpcoes.innerHTML = "";

  let opcoes = [verboAtual];
  while (opcoes.length < 4) {
    let sorteio = bancoDeVerbos[Math.floor(Math.random() * bancoDeVerbos.length)];
    if (!opcoes.includes(sorteio)) {
      opcoes.push(sorteio);
    }
  }

  opcoes.sort(() => Math.random() - 0.5);

  opcoes.forEach(v => {
    const btn = document.createElement("button");
    btn.className = "btn-opcao";
    btn.innerText = `${v.kanji} (${v.leitura})`;
    btn.onclick = () => verificarEtapa1(v);
    containerOpcoes.appendChild(btn);
  });
}

function verificarEtapa1(opcaoEscolhida) {
  const msg = document.getElementById("mensagem");

  if (opcaoEscolhida.kanji === verboAtual.kanji) {
    msg.innerText = "Correto!";
    msg.className = "mensagem correto";
    setTimeout(() => {
      msg.innerText = "";
      iniciarEtapa2();
    }, 800);
  } else {
    msg.innerText = "Incorreto. Tente novamente.";
    msg.className = "mensagem incorreto";
  }
}

function iniciarEtapa2() {
  document.getElementById("etapa1").style.display = "none";
  document.getElementById("etapa2").style.display = "block";
  document.getElementById("tela-fim").style.display = "none";

  document.getElementById("kanji-etapa2").innerText = verboAtual.kanji;
  document.getElementById("leitura-etapa2").innerText = `(${verboAtual.leitura})`;

  document.getElementById("tempo-alvo").innerText = tempoAtual.nome;
  document.getElementById("bloco-raiz").innerText = verboAtual.raiz;

  const caixaResposta = document.getElementById("caixa-resposta");
  caixaResposta.innerText = "";

  const containerSufixos = document.getElementById("sufixos-container");
  containerSufixos.innerHTML = "";

  todosSufixos.forEach((sufixo) => {
    const btn = document.createElement("button");
    btn.className = "btn-sufixo";
    btn.innerText = sufixo;
    btn.onclick = () => selecionarSufixo(sufixo, btn);
    containerSufixos.appendChild(btn);
  });
}

function selecionarSufixo(sufixo, elementoClicado) {
  if (document.getElementById("btn-proximo").style.display === "inline-block") return;

  sufixoSelecionado = sufixo;

  document.querySelectorAll(".btn-sufixo").forEach(b => b.classList.remove("ativo"));
  elementoClicado.classList.add("ativo");

  const caixaResposta = document.getElementById("caixa-resposta");
  caixaResposta.innerText = sufixo;
}

function verificarEtapa2() {
  const msg = document.getElementById("mensagem");
  const exp = document.getElementById("explicacao");

  if (!sufixoSelecionado) {
    msg.innerText = "Selecione uma terminação para preencher.";
    msg.className = "mensagem incorreto";
    return;
  }

  if (sufixoSelecionado === tempoAtual.correto) {
    msg.innerText = `Correto! A forma é ${verboAtual.raiz}${sufixoSelecionado}.`;
    msg.className = "mensagem correto";
    exp.innerText = "";
    acertosCount++;
    liberarProximo();
  } else {
    tentativasErros++;

    if (tentativasErros < 2) {
      msg.innerText = `Incorreto. Você tem mais 1 tentativa.`;
      msg.className = "mensagem incorreto";
    } else {
      msg.innerText = `Você esgotou as tentativas.`;
      msg.className = "mensagem incorreto";
      
      exp.innerText = `Resposta correta: ${verboAtual.raiz}${tempoAtual.correto}\nExplicação: Para o tempo "${tempoAtual.nome}", adicionamos a terminação "${tempoAtual.correto}" à raiz do verbo (${verboAtual.raiz}).`;
      
      document.getElementById("caixa-resposta").innerText = tempoAtual.correto;
      
      errosCount++;
      liberarProximo();
    }
  }
}

function liberarProximo() {
  questaoAtualIndex++;
  document.getElementById("btn-conferir").style.display = "none";
  document.getElementById("btn-proximo").style.display = "inline-block";
}

function proximaQuestao() {
  carregarQuestao();
}

function mostrarTelaFim() {
  document.getElementById("etapa1").style.display = "none";
  document.getElementById("etapa2").style.display = "none";
  document.getElementById("btn-proximo").style.display = "none";
  document.getElementById("mensagem").innerText = "";
  document.getElementById("explicacao").innerText = "";
  document.getElementById("tela-fim").style.display = "block";

  const total = acertosCount + errosCount;
  const porcAcerto = total > 0 ? Math.round((acertosCount / total) * 100) : 0;
  const porcErro = total > 0 ? Math.round((errosCount / total) * 100) : 0;

  document.getElementById("res-acertos").innerText = acertosCount;
  document.getElementById("porc-acertos").innerText = porcAcerto + "%";
  document.getElementById("res-erros").innerText = errosCount;
  document.getElementById("porc-erros").innerText = porcErro + "%";

  // Envia o resumo final para a planilha
  const dadosEnvio = {
    nome: nomeAluno,
    pontos: `${acertosCount}/${total}`,
    porcentagem: `${porcAcerto}%`,
    erros: `${errosCount} erros`,
    dataHora: new Date().toLocaleString("pt-BR")
  };

  fetch(URL_GOOGLE_SCRIPT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosEnvio)
  }).catch(erro => console.error("Erro ao enviar para planilha:", erro));
}

function reiniciarPratica() {
  questaoAtualIndex = 0;
  acertosCount = 0;
  errosCount = 0;
  document.getElementById("input-nome").value = "";
  document.getElementById("tela-fim").style.display = "none";
  document.getElementById("etapa-nome").style.display = "block";
}

// Configuração inicial
window.onload = function() {
  document.getElementById("etapa-nome").style.display = "block";
  document.getElementById("etapa1").style.display = "none";
  document.getElementById("etapa2").style.display = "none";
  document.getElementById("tela-fim").style.display = "none";
};

// Remove foco de botões ao clicar
document.addEventListener('mouseup', function(event) {
  if (event.target.tagName === 'BUTTON') {
    event.target.blur();
  }
});