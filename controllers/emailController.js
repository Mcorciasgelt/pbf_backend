const transporter = require('../config/email');
const Tarea = require('../models/Tarea');
const User = require('../models/User');

// lógica para el email diario recordatorio de las tareas del día siguiente
const enviarEmailDiario = async (req, res) => {
  try {
    const { padreId } = req.body;

    const padre = await User.findById(padreId);
    if (!padre || padre.tipo !== 'padre') {
      return res.status(404).json({ mensaje: 'Padre no válido' });
    }

    // Calcular fecha de mañana
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    mañana.setHours(0, 0, 0, 0);
    const pasado = new Date(mañana);
    pasado.setDate(mañana.getDate() + 1);

    const tareas = await Tarea.find({
      familiaId: padre.familiaId,
      fechaEntrega: { $gte: mañana, $lt: pasado }
    });

    // agrupa por cada hijo las tareas para enviarlas de esa manera en el cuerpo del email
    const hijosAgrupados = {};

        for (let tarea of tareas) {
        for (let hijoId of tarea.hijosAsociados) {
            if (!hijosAgrupados[hijoId]) {
            hijosAgrupados[hijoId] = [];
            }
            hijosAgrupados[hijoId].push(tarea);
        }
        }

        // obtener nombres de los hijos
        const hijos = await User.find({ _id: { $in: Object.keys(hijosAgrupados) } });

        let contenidoHTML = `<h3>Tareas para mañana (${mañana.toLocaleDateString()})</h3>`;

        for (let hijo of hijos) {
        contenidoHTML += `<h4>${hijo.nombre}</h4><ul>`;

        for (let tarea of hijosAgrupados[hijo._id.toString()]) {
            contenidoHTML += `
            <li>
                <a href="https://tufamiliaorganizada.com/tareas/${tarea._id}" target="_blank">
                <strong>${tarea.titulo}</strong>
                </a>: ${tarea.descripcion}
            </li>`;
        }

        contenidoHTML += `</ul>`;
        }

    await transporter.sendMail({
      from: `"Tu Familia Organizada" <${process.env.EMAIL_FROM}>`,
      to: padre.email,
      subject: 'Tareas para mañana',
      html: contenidoHTML
    });

    res.status(200).json({ mensaje: 'Se ha enviado el correo' })

  } catch (error) {
    console.error('Error al enviar correo:', error.message);
    res.status(500).json({ mensaje: 'Ha ocurrido un error al enviar el correo' })
  }
};


// repito la misma lógica pero para enviar el email semanal (cambiarán los rangos)
// intenté hacerlo de otra forma con reutilización de componentes pero no lo conseguí, continuo así por no atascar el desarrollo

const enviarEmailSemanal = async (req, res) => {
    try {
      const { padreId } = req.body;
  
      const padre = await User.findById(padreId);
      if (!padre || padre.tipo !== 'padre') {
        return res.status(404).json({ mensaje: 'Padre no válido' });
      }
  
      // Calcular el próximo lunes y domingo
      const hoy = new Date();
      const diaSemana = hoy.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
  
      const proximoLunes = new Date(hoy);
      proximoLunes.setDate(hoy.getDate() + ((8 - diaSemana) % 7 || 7));
      proximoLunes.setHours(0, 0, 0, 0);
  
      const proximoDomingo = new Date(proximoLunes);
      proximoDomingo.setDate(proximoLunes.getDate() + 6);
      proximoDomingo.setHours(23, 59, 59, 999);
  
      const tareas = await Tarea.find({
        familiaId: padre.familiaId,
        fechaEntrega: { $gte: proximoLunes, $lte: proximoDomingo }
      });
  
      // Agrupar tareas por hijo
      const hijosAgrupados = {};
      for (let tarea of tareas) {
        for (let hijoId of tarea.hijosAsociados) {
          if (!hijosAgrupados[hijoId]) {
            hijosAgrupados[hijoId] = [];
          }
          hijosAgrupados[hijoId].push(tarea);
        }
      }
  
      const hijos = await User.find({ _id: { $in: Object.keys(hijosAgrupados) } });
  
      let contenidoHTML = `<h3>Tareas para la semana del ${proximoLunes.toLocaleDateString()} al ${proximoDomingo.toLocaleDateString()}</h3>`;
  
      for (let hijo of hijos) {
        contenidoHTML += `<h4>${hijo.nombre}</h4><ul>`;
  
        for (let tarea of hijosAgrupados[hijo._id.toString()]) {
          contenidoHTML += `
            <li>
              <a href="https://tufamiliaorganizada.com/tareas/${tarea._id}" target="_blank">
                <strong>${tarea.titulo}</strong>
              </a>: ${tarea.descripcion}
            </li>`;
        }
  
        contenidoHTML += `</ul>`;
      }
  
      await transporter.sendMail({
        from: `"Tu Familia Organizada" <${process.env.EMAIL_FROM}>`,
        to: padre.email,
        subject: 'Tareas de la próxima semana',
        html: contenidoHTML
      });
  
      res.status(200).json({ mensaje: 'Correo semanal enviado correctamente' });
  
    } catch (error) {
      console.error('Error al enviar correo semanal:', error.message);
      res.status(500).json({ mensaje: 'Error al enviar el correo semanal' });
    }
  }

  
  
  module.exports = {
    enviarEmailDiario,
    enviarEmailSemanal
  }