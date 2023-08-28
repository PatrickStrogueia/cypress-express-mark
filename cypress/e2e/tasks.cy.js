/// <reference types="cypress" />

// yarn add @faker-js/faker --dev
// yarn remove @faker-js/faker
// import {faker} from '@faker-js/faker'

describe('tarefas', () => {

    let testeData;

    before( () => {
        cy.fixture('tasks').then(t => {
            testeData = t
        })
    })

    // beforeEach(() => {
    //     cy.viewport(1920, 1080)
    // })

    context('cadastro', () => {
        it('deve cadastrar uma nova tarefa', () => {

            const taskName = 'Ler um livro de Node.js'
    
            cy.removeTaskByName(taskName)
    
            cy.createTask(taskName)
    
            // cy.get('main div p')
            //     .should('be.visible')
            //     .should('have.text', 'Ler um livro de Node.js')
    
            // cy.contains('main div p', "Batatinha quando nasce")
            cy.contains('main div p', taskName)
                .should('be.visible')
        })
    
        it('não deve permitir tarefa duplicada', () => {
    
            const task = testeData.dup
    
            cy.removeTaskByName(task.name)
    
            // Dado que eu tenha uma tarefa duplicada
    
            cy.postTask(task)
    
            // cy.visit('http://localhost:8080')
            // cy.get('input[placeholder="Add a new Task"]').type('Estudar Javascript')
            // cy.contains('button', 'Create').click()
    
            // Quando faço o cadastro dessa tarefa
    
            cy.createTask(task.name)
    
            // Então vejo a mensagem de duplicidade
    
            cy.get('.swal2-html-container')
                .should('be.visible')
                .should('have.text', 'Task already exists!')
        })
    
        it('campo obrigatório', () => {
            cy.createTask()
            cy.isRequired('This is a required field')
        })
    })

    context('atualização', () => {
        it('deve concluir uma tarefa', () => {
            const task = {
                name: 'tarefa 1',
                is_done: false
            }

            cy.removeTaskByName(task.name)
            cy.postTask(task)

            cy.visit('/')

            // (//p[contains(text(), "tarefa 1")]/..//button)[1]
            // button[class*=ItemToggle]
            cy.contains('p', task.name)
                .parent()
                .find('button[class*=ItemToggle]')
                .click()

            cy.contains('p', task.name)
                .should('have.css', 'text-decoration-line', 'line-through')
        })
    })

    context('exclusão', () => {
        it('deve remover uma tarefa', () => {
            const task = {
                name: 'tarefa 2',
                is_done: false
            }

            cy.removeTaskByName(task.name)
            cy.postTask(task)

            cy.visit('/')

            cy.contains('p', task.name)
                .parent()
                .find('button[class*=ItemDelete]')
                .click()

            cy.contains('p', task.name)
                .should('not.exist')
        })
    })
})

