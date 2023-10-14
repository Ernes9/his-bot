import alumnos from "./alumnos.json" assert { type: "json" };

const staff = [
  { nombre: "Ernes", numero: "+54 9 342 535-0941" },
  { nombre: "Rorro", numero: "+54 9 11 2866-3219" },
  { nombre: "Martino", numero: "+54 9 2915 13-4398" },
  { nombre: "Nacho", numero: "+54 9 11 5957-8356" },
  { nombre: "Facu", numero: "+598 99 377 548" },
];

// Agrupación por etapa
let etapas = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
};

alumnos.forEach((alumno) => {
  etapas[alumno.etapa].push(alumno.nombre);
});

const distribuirEntreStaff = (etapa, staffDisponible) => {
  let distribucion = {};
  let staffCount = Array(staffDisponible.length).fill(0);

  etapa.forEach((nombre, index) => {
    let miembroActual = staffDisponible[index % staffDisponible.length];
    distribucion[nombre] = miembroActual;
    staffCount[staffDisponible.indexOf(miembroActual)]++;
  });

  return [distribucion, staffCount];
};

let resultados = {};
let conteos = Array(staff.length).fill(0);

// Distribución preferente por etapas
for (let i = 1; i <= 4; i++) {
  let [dist, count] = distribuirEntreStaff(etapas[i], [staff[i - 1]]);
  resultados[i] = dist;
  conteos[i - 1] += count[0];
}

// Distribución de la etapa 5 entre los últimos dos miembros del staff
let [distE5, countE5] = distribuirEntreStaff(etapas[5], [staff[3], staff[4]]);
resultados[5] = distE5;
conteos[3] += countE5[0];
conteos[4] += countE5[1];

const redistribuirEstudiantes = (origen, destino, cantidad) => {
  let transferidos = 0;
  for (let etapa in resultados) {
    for (let alumno in resultados[etapa]) {
      if (transferidos < cantidad && resultados[etapa][alumno] === origen) {
        resultados[etapa][alumno] = destino;
        transferidos++;
      }
    }
  }
};

// Redistribución para equilibrar
for (let i = 0; i < staff.length - 1; i++) {
  for (let j = i + 1; j < staff.length; j++) {
    let diff = Math.abs(conteos[i] - conteos[j]);
    if (diff > 6) {
      let transfiere = Math.floor(diff / 2);
      if (conteos[i] > conteos[j]) {
        redistribuirEstudiantes(staff[i], staff[j], transfiere);
        conteos[i] -= transfiere;
        conteos[j] += transfiere;
      } else {
        redistribuirEstudiantes(staff[j], staff[i], transfiere);
        conteos[j] -= transfiere;
        conteos[i] += transfiere;
      }
    }
  }
}

const generarMensaje = (resultados) => {
  let mensaje =
    "Buenas tardes @Appointment Setters en Formacion. hoy 18:00 19:00 simulacros\n\n";

  for (let staffMember of staff) {
    let etapasDelStaff = [];
    for (let etapa in resultados) {
      for (let alumno in resultados[etapa]) {
        if (resultados[etapa][alumno].nombre === staffMember.nombre) {
          if (!etapasDelStaff.includes(etapa)) {
            etapasDelStaff.push(etapa);
          }
        }
      }
    }

    if (etapasDelStaff.length > 0) {
      mensaje += `Con @${staffMember.nombre} ${
        staffMember.numero ? `(${staffMember.numero})` : ""
      }\n`;

      etapasDelStaff.forEach((etapa) => {
        let alumnosAsignados = Object.keys(resultados[etapa]).filter(
          (alumno) => resultados[etapa][alumno].nombre === staffMember.nombre
        );
        if (alumnosAsignados.length === etapas[etapa].length) {
          mensaje += `Etapa ${etapa}\n\n`;
        } else {
          mensaje += `Etapa ${etapa}\n\n`;
          alumnosAsignados.forEach((alumno) => {
            mensaje += `${alumno}\n`;
          });
          mensaje += "\n";
        }
      });
    }
  }

  mensaje +=
    "Hablen con su nombre, correo y etapa.\nNosotros les pasamos los perfiles a prospectar.\nHablar ANTES DE LAS 18:00, los chats se archivan para tener solo a los que rinden";
  return mensaje;
};

const mensaje = generarMensaje(resultados);

export { generarMensaje, resultados };
