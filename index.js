const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

const credenciales = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'biblioteca',
}

const db = mysql.createConnection(credenciales);
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

// Ruta para crear un libro nuevo
app.post('/crear-libro', (req, res) => {
    const { titulo, descripcion, imagen, anio, categoria, nombreAutor } = req.body;

    // Verifica que se proporcionen todos los campos necesarios
    if (!titulo || !descripcion || !imagen || !anio || !categoria || !nombreAutor) {
        return res.status(400).json({ message: 'Por favor, proporcione todos los campos necesarios' });
    }

    // Crea una consulta SQL para insertar un nuevo libro en la base de datos
    const insertQuery = 'INSERT INTO libro (titulo, descripcion, imagen, anio, categoria, nombreAutor) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(insertQuery, [titulo, descripcion, imagen, anio, categoria, nombreAutor], (err, result) => {
        if (err) {
            console.error('Error al insertar el libro en la base de datos: ' + err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
 
        
        // Si la inserción fue exitosa, devuelve una respuesta con el ID del libro insertado
        res.status(201).json({ message: 'Libro creado exitosamente', libroId: result.insertId });
    });
});




// Ruta para obtener todos los libros
app.get('/libros', (req, res) => {
    // Crea una consulta SQL para seleccionar todos los libros
    const selectQuery = 'SELECT * FROM libro';

    db.query(selectQuery, (err, result) => {
        if (err) {
            console.error('Error al obtener libros de la base de datos: ' + err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        // Devuelve la lista de libros como respuesta en formato JSON
        res.status(200).json({ libros: result });
    });

    // Cierra la conexión a la base de datos después de la inserción

});

// Ruta para obtener todos los libros
app.get('/detallesLibro/:idlibro', (req, res) => {
    // Extrae el ID del libro de los parámetros de la ruta
    const { idlibro } = req.params;
    
    // Crea una consulta SQL para seleccionar todos los libros
    const selectQuery = 'SELECT * FROM libro WHERE idlibro = ?';

    db.query(selectQuery, (err, result) => {
        if (err) {
            console.error('Error al obtener libros de la base de datos: ' + err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        // Devuelve la lista de libros como respuesta en formato JSON
        res.status(200).json({ libros: result });
    });

    // Cierra la conexión a la base de datos después de la inserción

});

// Ruta para eliminar un libro
app.delete('/libros/:idlibro', (req, res) => {
    // Extrae el ID del libro de los parámetros de la ruta
    const { idlibro } = req.params;

    // Crea una consulta SQL para eliminar el libro
    const deleteQuery = 'DELETE FROM libro WHERE idlibro = ?';

    db.query(deleteQuery, idlibro, (err, result) => {
        if (err) {
            console.error('Error al eliminar el libro de la base de datos: ' + err);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }

        // Si la eliminación fue exitosa, devuelve una respuesta con el número de filas afectadas
        res.status(200).json({ message: 'Libro eliminado exitosamente', affectedRows: result.affectedRows });
    });
});


app.put('/Actualizar/:idlibro', (req, res) => {
    console.log('Recibida solicitud PUT a /Actualizar/:idlibro');
    const { titulo, descripcion, imagen, anio, categoria, nombreAutor } = req.body;
    const { idlibro } = req.params;

    console.log('ID del libro:', idlibro);
    console.log('Datos a actualizar:', { titulo, descripcion, imagen, anio, categoria, nombreAutor });
    const sql = 'UPDATE libro SET titulo = ?, descripcion = ?, imagen = ?, anio= ?, categoria= ?, nombreAutor= ? WHERE idlibro = ?';

    db.query(sql, [titulo, descripcion, imagen, anio, categoria, nombreAutor, idlibro], (error, result) => {
        if (error) {
            console.error('Error al ejecutar la consulta SQL:', error);
            return res.status(500).json({ message: 'Error al actualizar el libro' });
        }

        res.status(200).json({ message: 'Libro actualizado exitosamente', affectedRows: result.affectedRows });
    });
});

app.use((err, req, res, next) => {
    console.error('Error en el middleware:', err.stack);
    res.status(500).json({ message: 'Se produjo un error en el servidor' });
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
