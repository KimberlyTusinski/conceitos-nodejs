const express = require('express')
const cors = require('cors')

const {uuid, isUuid} = require('uuidv4')

//const { v4: uuid } = require('uuid')

const app = express()

const repositories = []

function validateRepositorytId(request, response, next) {
  const {id} = request.params
  
  console.log(id)

  if(!isUuid(id)) {
      return response.status(400).send()
  }

  return next()
}

app.use(express.json())
app.use(cors())

app.use('/repositories/:id', validateRepositorytId)

app.get('/repositories', (request, response) => response.json(repositories))

app.post('/repositories', (request, response) => {
  const {title, url, techs} = request.body

  const repository = {id: uuid(), title, url, techs, likes: 0}

  repositories.push(repository)

  return response.json(repository)
})

app.put('/repositories/:id', (request, response) => {
  const {id} = request.params

  const {title, url, techs} = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  const repository = {id, title, url, techs, likes: repositories[repositoryIndex].likes}

  repositories[repositoryIndex] = repository

  return response.json(repository)
})

app.delete('/repositories/:id', (request, response) => {
  const {id} = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

app.post('/repositories/:id/like', (request, response) => {
  const {id} = request.params

  const repository = repositories.find(repository => repository.id === id)

  repository.likes++

  return response.json(repository)
})

module.exports = app