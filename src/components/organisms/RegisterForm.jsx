import React, { useMemo, useState } from 'react';

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    edad: ''
  });

  const [errores, setErrores] = useState({});

  // Detecta correo DUOC (ajusta dominios si tu profe pide uno específico)
  const esDuoc = useMemo(() => {
    const email = form.email.trim().toLowerCase();
    return email.endsWith('@duoc.cl') || email.endsWith('@duocuc.cl');
  }, [form.email]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const validar = () => {
    const erroresTemp = {};

    // Nombre
    if (!form.nombre.trim()) {
      erroresTemp.nombre = 'El nombre es obligatorio';
    } else if (form.nombre.trim().length < 2) {
      erroresTemp.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Edad (requisito +18)
    if (!form.edad) {
      erroresTemp.edad = 'La edad es obligatoria';
    } else if (Number(form.edad) < 18) {
      erroresTemp.edad = 'Debes ser mayor de 18 años para registrarte';
    }

    // Email
    if (!form.email.trim()) {
      erroresTemp.email = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      erroresTemp.email = 'Email no válido';
    }

    // Password
    if (!form.password.trim()) {
      erroresTemp.password = 'La contraseña es obligatoria';
    } else if (form.password.length < 6) {
      erroresTemp.password = 'Debe tener al menos 6 caracteres';
    }

    setErrores(erroresTemp);
    return Object.keys(erroresTemp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const descuento = esDuoc ? 0.2 : 0;
    const msgDescuento = esDuoc
      ? '🎉 ¡Descuento DUOC del 20% aplicado de por vida!'
      : 'Sin descuento DUOC (puedes usar un correo DUOC para obtener 20%).';
      const user = {
  nombre: form.nombre.trim(),
  email: form.email.trim().toLowerCase(),
  password: form.password,
  edad: Number(form.edad),
  descuentoDuoc: esDuoc ? 0.2 : 0
};

localStorage.setItem('lug_user', JSON.stringify(user));
localStorage.setItem('lug_session', 'true');


    alert(
      `¡Registro exitoso!\n\nNombre: ${form.nombre}\nEdad: ${form.edad}\nEmail: ${form.email}\n${msgDescuento}`
    );

    setForm({ nombre: '', email: '', password: '', edad: '' });
    setErrores({});
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-primary rounded bg-dark text-white">
      <h3 className="mb-3 text-success" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        Registro de Guerrero
      </h3>

      {/* Nombre */}
      <div className="mb-3 text-start">
        <label className="form-label">Nombre Completo</label>
        <input
          type="text"
          name="nombre"
          className="form-control bg-secondary text-white border-0"
          value={form.nombre}
          onChange={handleChange}
        />
        {errores.nombre && <small className="text-warning fw-bold">{errores.nombre}</small>}
      </div>

      {/* Edad */}
      <div className="mb-3 text-start">
        <label className="form-label">Edad</label>
        <input
          type="number"
          name="edad"
          className="form-control bg-secondary text-white border-0"
          value={form.edad}
          onChange={handleChange}
        />
        {errores.edad && <small className="text-warning fw-bold">{errores.edad}</small>}
      </div>

      {/* Email */}
      <div className="mb-2 text-start">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-control bg-secondary text-white border-0"
          value={form.email}
          onChange={handleChange}
        />
        {errores.email && <small className="text-warning fw-bold">{errores.email}</small>}
      </div>

      {/* Mensaje DUOC en vivo */}
      {form.email.trim().length > 0 && (
        <div className={`alert py-2 mt-2 ${esDuoc ? 'alert-success' : 'alert-info'}`} role="alert">
          {esDuoc
            ? '🎉 Correo DUOC detectado: 20% de descuento de por vida.'
            : 'Tip: usa un correo DUOC para obtener 20% de descuento de por vida.'}
        </div>
      )}

      {/* Password */}
      <div className="mb-3 text-start">
        <label className="form-label">Contraseña</label>
        <input
          type="password"
          name="password"
          className="form-control bg-secondary text-white border-0"
          value={form.password}
          onChange={handleChange}
        />
        {errores.password && <small className="text-warning fw-bold">{errores.password}</small>}
      </div>

      <button type="submit" className="btn btn-success w-100 fw-bold shadow-sm">
        UNIRSE A LA COMUNIDAD
      </button>
    </form>
  );
}
