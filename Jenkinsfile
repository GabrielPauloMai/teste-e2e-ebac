pipeline {
    agent any

    stages {
        stage('Clonar o repositório') {
            steps {
                git branch: 'main', url: 'https://github.com/GabrielPauloMai/teste-e2e-ebac.git'
            }
        }

        stage('Instalar dependências') {
            steps {
                ansiColor('css') {
                    sh 'npm install'
                }
            }
        }


        stage('Executar testes com Cypress') {
            steps {
                ansiColor('css') {
                    sh 'npm test'
                }
            }
        }
    }
}
