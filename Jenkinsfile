pipeline {
    agent any

    environment {
        // Image / container
        CONTAINER_NAME = 'hai-radio-api'
        IMAGE_NAME = 'hai-radio-api'
        IMAGE_TAG = "${BUILD_NUMBER}"

        // Ports
        HOST_PORT = '3174'      // port exposé sur l'hôte
        CONTAINER_PORT = '3174'      // port utilisé par l'app dans le conteneur

        // Ressources
        MEMORY_LIMIT = '512m'
        MEMORY_RESERVATION = '256m'
        CPU_SHARES = '512'

        // Application (production)
        PORT='3174'
        NODE_ENV='production'

        // PostgreSQL
        DATABASE_HOST=credentials('DB_HOST_ID')
        DATABASE_PORT=credentials('DB_PORT_ID')
        DATABASE_USER=credentials('DB_USER_ID')
        DATABASE_PASSWORD=credentials('DB_PASSWORD_ID')
        DATABASE_NAME=hai_radio

        // JWT
        JWT_SECRET=credentials('JWT_SECRET_ID')
        JWT_REFRESH_SECRET=credentials('JWT_REFRESH_SECRET_ID')
        JWT_EXPIRES_IN=7d

        // CORS
        CLIENT_URL='https://hai-radio.itdcmada.com'
        ADMIN_URL='https://hai-radio-admin.itdcmada.com'

        // Radio
        RADIO_STREAM_URL='https://your-radio-stream.com/live'

        MINIO_ENDPOINT=credentials('MINIO_ENDPOINT_ID')
        MINIO_PORT=credentials('MINIO_PORT_ID')
        MINIO_ACCESS_KEY=credentials('MINIO_ACCESS_KEY_ID')
        MINIO_SECRET_KEY=credentials('MINIO_SECRET_KEY_ID')

        // Logging options
        LOG_DRIVER = 'json-file'
        LOG_MAX_SIZE = '10m'
        LOG_MAX_FILE = '3'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                script {
                    echo "Construction de l'image Docker ${IMAGE_NAME}:${IMAGE_TAG}..."
                    sh '''
                        docker build \
                        --build-arg APP_PORT=${APP_PORT} \
                        --build-arg NODE_ENV=${NODE_ENV} \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} .
                        
                        echo "Image construite : ${IMAGE_NAME}:${IMAGE_TAG}"
                        docker images | grep ${IMAGE_NAME} || true
                    '''
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    echo "Arrêt/suppression de l'ancien conteneur (si présent)..."
                    sh '''
                        OLD=$(docker ps -aq -f name=${CONTAINER_NAME} || true)
                        if [ -n "$OLD" ]; then
                        echo "Conteneur ${CONTAINER_NAME} détecté, arrêt en cours..."
                        docker stop ${CONTAINER_NAME} || true
                        sleep 2
                        docker rm ${CONTAINER_NAME} || true
                        echo "Ancien conteneur supprimé"
                        else
                        echo "Aucun conteneur ${CONTAINER_NAME} en cours d'exécution"
                        fi
                    '''
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    echo "Déploiement du conteneur ${IMAGE_NAME}:${IMAGE_TAG}..."
                    // Démarrer le conteneur en passant les variables environ nécessaires.
                    // Les valeurs sensibles sont injectées par withCredentials et masquées dans les logs Jenkins.
                    sh '''
                    docker run -d \
                        --memory ${MEMORY_LIMIT} \
                        --memory-reservation ${MEMORY_RESERVATION} \
                        --cpu-shares ${CPU_SHARES} \
                        --name ${CONTAINER_NAME} \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        --restart unless-stopped \
                        --log-driver ${LOG_DRIVER} \
                        --log-opt max-size=${LOG_MAX_SIZE} \
                        --log-opt max-file=${LOG_MAX_FILE} \
                        -e "NODE_ENV=${NODE_ENV}" \
                        -e "DATABASE_HOST=${DATABASE_HOST}" \
                        -e "DATABASE_PORT=${DATABASE_PORT}" \
                        -e "DATABASE_USER=${DATABASE_USER}" \
                        -e "DATABASE_PASSWORD=${DATABASE_PASSWORD}" \
                        -e "DATABASE_NAME=${DATABASE_NAME}" \
                        -e "MINIO_ENDPOINT=${MINIO_ENDPOINT}" \
                        -e "MINIO_HOST=${MINIO_HOST}" \
                        -e "MINIO_PORT=${MINIO_PORT}" \
                        -e "MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}" \
                        -e "MINIO_SECRET_KEY=${MINIO_SECRET_KEY}" \
                        -e "PERF_LOG=${PERF_LOG}" \
                        -e "PERF_SQL=${PERF_SQL}" \
                        -e "PERF_SLOW_MS=${PERF_SLOW_MS}" \
                        -e "JWT_SECRET=${JWT_SECRET}" \
                        -e "JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}" \
                        -e "JWT_EXPIRES_IN=${JWT_EXPIRES_IN}" \
                        -e "CLIENT_URL=${CLIENT_URL}" \
                        -e "ADMIN_URL=${ADMIN_URL}" \
                        -e "RADIO_STREAM_URL=${RADIO_STREAM_URL}" \
                        ${IMAGE_NAME}:${IMAGE_TAG}
                    sleep 3
                    echo "Conteneur démarré (${CONTAINER_NAME}) — image ${IMAGE_NAME}:${IMAGE_TAG}"
                    '''
                    } // end withCredentials
                }
            }
        }
    } // end stages

    post {
        success {
            script {
                echo "Pipeline terminé avec succès!"
                sh '''
                    echo "Résumé du déploiement :"
                    echo "- Image : ${IMAGE_NAME}:${IMAGE_TAG}"
                    echo "- Conteneur : ${CONTAINER_NAME}"
                    echo "- Hôte -> Conteneur : ${HOST_PORT}:${CONTAINER_PORT}"
                    echo "- Mémoire : ${MEMORY_LIMIT} (réservation: ${MEMORY_RESERVATION})"
                    echo "- CPU Shares : ${CPU_SHARES}"
                    '''
            }
        }

        failure {
            script {
                echo "Pipeline échoué — récupération de diagnostics (sans secrets)..."
                sh '''
                    echo "--- Logs du conteneur (si présent) ---"
                    docker logs ${CONTAINER_NAME} 2>&1 | tail -n 200 || echo "Conteneur non trouvé"
                    echo ""
                    echo "--- Images disponibles ---"
                    docker images | grep ${IMAGE_NAME} || echo "Aucune image trouvée"
                    echo ""
                    echo "--- Conteneurs ---"
                    docker ps -a --filter "name=${CONTAINER_NAME}" || true
                '''
            }
        }

        always {
            script {
                echo "Nettoyage workspace..."
            }
            cleanWs()
        }
    }
}
