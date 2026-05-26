import {
    getContatos,
    postContato,
    putContato,
    deleteContato
  } from "./contatos.js"
  
  let contatoEditando = null
  
  const dom = {
    nome: document.getElementById("inp-nome"),
    celular: document.getElementById("inp-celular"),
    email: document.getElementById("inp-email"),
    cidade: document.getElementById("inp-cidade"),
    endereco: document.getElementById("inp-endereco"),
    url: document.getElementById("inp-url"),
    btnSalvar: document.getElementById("btn-cadastrar"),
    btnCancel: document.getElementById("btn-cancelar"),
    preview: document.getElementById("foto-preview"),
    tbody: document.getElementById("tbody-contatos"),
    toast: document.getElementById("toast")
  }
  
  function showToast(msg, type = "success") {
    dom.toast.textContent = msg
    dom.toast.className = `toast show ${type}`
  
    setTimeout(() => {
      dom.toast.className = "toast"
    }, 3000)
  }
  
  function setFoto(src) {
    dom.preview.src = src || ""
    dom.preview.classList.toggle("hidden", !src)
  }
  
  function getFormData() {
    return {
      nome: dom.nome.value.trim(),
      celular: dom.celular.value.trim(),
      email: dom.email.value.trim(),
      cidade: dom.cidade.value.trim(),
      endereco: dom.endereco.value.trim(),
      foto: dom.url.value.trim()
    }
  }
  
  function clearForm() {
    [dom.nome, dom.celular, dom.email, dom.cidade, dom.endereco, dom.url].forEach(
      input => (input.value = "")
    )
  
    setFoto(null)
    contatoEditando = null
    dom.btnSalvar.textContent = "CADASTRAR CONTATO"
  }
  
  function startEdit(contato) {
    contatoEditando = contato.id
    dom.nome.value = contato.nome || ""
    dom.celular.value = contato.celular || ""
    dom.email.value = contato.email || ""
    dom.cidade.value = contato.cidade || ""
    dom.endereco.value = contato.endereco || ""
    dom.url.value = contato.foto || ""
    setFoto(contato.foto)
    dom.btnSalvar.textContent = "SALVAR ALTERAÇÕES"
    dom.nome.focus()
  }
  
  function renderContatos(contatos) {
    dom.tbody.replaceChildren()
  
    if (!contatos.length) {
      const tr = document.createElement("tr")
      const td = document.createElement("td")
  
      td.colSpan = 8
      td.textContent = "Nenhum contato cadastrado ainda."
      tr.appendChild(td)
      dom.tbody.appendChild(tr)
  
      return
    }
  
    contatos.forEach(c => {
      const tr = document.createElement("tr")
      const tdId = document.createElement("td")
      const tdFoto = document.createElement("td")
      const tdNome = document.createElement("td")
      const tdCelular = document.createElement("td")
      const tdEmail = document.createElement("td")
      const tdEndereco = document.createElement("td")
      const tdCidade = document.createElement("td")
      const tdAcoes = document.createElement("td")
      const divAcoes = document.createElement("div")
      const btnEdit = document.createElement("button")
      const btnDelete = document.createElement("button")
      const iconEdit = document.createElement("i")
      const iconDelete = document.createElement("i")
  
      tdId.textContent = c.id
      tdNome.textContent = c.nome || ""
      tdCelular.textContent = c.celular || ""
      tdEmail.textContent = c.email || ""
      tdEndereco.textContent = c.endereco || ""
      tdCidade.textContent = c.cidade || ""
  
      if (c.foto) {
        const img = document.createElement("img")
        img.src = c.foto
        img.alt = "foto"
        img.className = "foto-perfil"
        tdFoto.appendChild(img)
      } else {
        const div = document.createElement("div")
        div.className = "inicial-perfil"
        div.textContent = (c.nome || "?")[0].toUpperCase()
        tdFoto.appendChild(div)
      }
  
      divAcoes.className = "acoes"
  
      btnEdit.className = "btn-edit"
      btnEdit.title = "Editar"
      iconEdit.className = "fa-solid fa-pen-to-square"
      btnEdit.appendChild(iconEdit)
      btnEdit.addEventListener("click", () => startEdit(c))
  
      btnDelete.className = "btn-delete"
      btnDelete.title = "Excluir"
      iconDelete.className = "fa-solid fa-trash"
      btnDelete.appendChild(iconDelete)
      btnDelete.addEventListener("click", () => handleDelete(c.id))
  
      divAcoes.append(btnEdit, btnDelete)
      tdAcoes.appendChild(divAcoes)
  
      tr.append(
        tdId,
        tdFoto,
        tdNome,
        tdCelular,
        tdEmail,
        tdEndereco,
        tdCidade,
        tdAcoes
      )
  
      dom.tbody.appendChild(tr)
    })
  }
  
  async function loadContatos() {
    try {
      const contatos = await getContatos()
      renderContatos(contatos || [])
    } catch (error) {
      console.log(error)
      showToast("Erro ao carregar contatos.", "error")
    }
  }
  
  async function handleDelete(id) {
    if (!confirm("Deseja excluir este contato?")) return
  
    try {
      await deleteContato(id)
      showToast("Contato excluído.")
      await loadContatos()
    } catch {
      showToast("Erro ao excluir contato.", "error")
    }
  }
  
  dom.btnSalvar.addEventListener("click", async () => {
    const data = getFormData()
  
    if (!data.nome || !data.celular || !data.email || !data.cidade || !data.endereco) {
      return showToast("Preencha todos os campos obrigatórios.", "error")
    }
  
    try {
      if (contatoEditando !== null) {
        await putContato(contatoEditando, data)
        showToast("Contato atualizado com sucesso!")
      } else {
        await postContato(data)
        showToast("Contato cadastrado com sucesso!")
      }
  
      clearForm()
      await loadContatos()
    } catch {
      showToast("Erro ao salvar contato.", "error")
    }
  })
  
  dom.btnCancel.addEventListener("click", clearForm)
  
  dom.url.addEventListener("input", () => {
    setFoto(dom.url.value.trim())
  })
  
  loadContatos()
  