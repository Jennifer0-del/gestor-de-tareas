document.addEventListener('DOMContentLoaded', () => {
    const auth = document.getElementById('auth');
    const authForm = document.getElementById('auth-form');
    const toggleAuth = document.getElementById('toggle-auth');
    const taskManager = document.getElementById('task-manager');

    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const generatePDFBtn = document.getElementById('generate-pdf-btn');

    let isLogin = true;

    // Toggle entre login y registro
    toggleAuth.addEventListener('click', () => {
        isLogin = !isLogin;
        document.getElementById('auth-title').innerText = isLogin ? 'Iniciar Sesión' : 'Registrarme';
        authForm.querySelector('button').innerText = isLogin ? 'Entrar' : 'Registrarme';
        toggleAuth.innerHTML = isLogin
            ? '¿No tienes cuenta? <span>Registrarme</span>'
            : '¿Ya tienes cuenta? <span>Iniciar Sesión</span>';
    });

    // Manejo del login/registro
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isLogin) {
            auth.style.display = 'none';
            taskManager.style.display = 'block';
        } else {
            alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
            isLogin = true;
            toggleAuth.click();
        }
    });

    // Agregar tarea
    addTaskBtn.addEventListener('click', () => {
        const taskTitle = document.getElementById('task-title').value.trim();
        const taskNote = document.getElementById('task-note').value.trim();
        const imageInput = document.getElementById('image-input');
        const imageFile = imageInput.files[0];

        if (!taskTitle || !taskNote) {
            alert('Por favor, completa el título y la nota.');
            return;
        }

        const taskItem = document.createElement('li');
        const imageElement = imageFile
            ? `<img src="${URL.createObjectURL(imageFile)}" alt="Imagen">`
            : '';

        taskItem.innerHTML = `
            <strong>${taskTitle}</strong>
            <p>${taskNote}</p>
            ${imageElement}
            <div class="task-actions">
                <button class="edit">Editar</button>
                <button class="delete">Eliminar</button>
            </div>
        `;

        taskList.appendChild(taskItem);

        taskItem.querySelector('.delete').addEventListener('click', () => {
            taskItem.remove();
        });

        taskItem.querySelector('.edit').addEventListener('click', () => {
            const newTitle = prompt('Editar título', taskTitle);
            const newNote = prompt('Editar nota', taskNote);
            if (newTitle !== null && newNote !== null) {
                taskItem.querySelector('strong').innerText = newTitle;
                taskItem.querySelector('p').innerText = newNote;
            }
        });

        // Limpiar campos
        document.getElementById('task-title').value = '';
        document.getElementById('task-note').value = '';
        imageInput.value = '';
    });

    // Generar PDF
    generatePDFBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 10; // Coordenada inicial de Y
        const tasks = document.querySelectorAll('#task-list li');

        tasks.forEach((task, index) => {
            const title = task.querySelector('strong').innerText;
            const note = task.querySelector('p').innerText;
            const imgElement = task.querySelector('img');

            // Agregar título y nota al PDF
            doc.text(`Tarea ${index + 1}`, 10, y);
            y += 10;
            doc.text(`Título: ${title}`, 10, y);
            y += 10;
            doc.text(`Nota: ${note}`, 10, y);
            y += 10;

            // Si hay imagen, agregarla
            if (imgElement) {
                const imgSrc = imgElement.src;

                // Crear una imagen de tipo Base64 para jsPDF
                const img = new Image();
                img.src = imgSrc;

                // Usar una promesa para garantizar la carga de la imagen antes de añadirla
                img.onload = () => {
                    doc.addImage(img, 'JPEG', 10, y, 50, 30); // Añadir la imagen al PDF
                    y += 40; // Mover Y para la siguiente entrada
                };
            } else {
                y += 10; // Si no hay imagen, solo saltar espacio
            }

            // Mover Y para evitar superposición
            y += 10;
            if (y > 280) {
                doc.addPage(); // Añadir nueva página si supera el límite
                y = 10;
            }
        });

        setTimeout(() => {
            doc.save('tareas.pdf');
        }, 500); // Dar un pequeño margen para cargar imágenes
    });
});















