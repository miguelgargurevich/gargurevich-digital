export default function ResultsByLevelSection() {
  const stories = [
    {
      business: "Taller mecánico: 'El Turbo'",
      problem: 'Pocos clientes fuera de horario',
      solution: 'Agente IA agenda citas nocturnas',
      result: '+40% citas fuera de horario',
    },
    {
      business: "Clínica dental: 'Sonrisa'",
      problem: 'Recepcionista saturada de consultas',
      solution: 'Bot responde precios 24/7',
      result: 'Recepcionista liberada 3h/día',
    },
    {
      business: "Consultoría: 'G&A'",
      problem: 'Mucho tiempo en transcribir llamadas',
      solution: 'Whisper transcribe llamadas',
      result: 'Ahorro S/2,000/mes en administrativo',
    },
  ];
  return (
    <section className="relative py-10 md:py-14 px-4 md:px-8 bg-white rounded-md shadow-sm mt-8 mb-8">
      <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-900">Resultados reales por nivel</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map((s, i) => (
          <div key={i} className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-md flex flex-col gap-2 shadow">
            <div className="font-semibold text-blue-700">{s.business}</div>
            <div className="text-gray-700 text-sm"><span className="font-medium">Problema:</span> {s.problem}</div>
            <div className="text-gray-700 text-sm"><span className="font-medium">Solución IA:</span> {s.solution}</div>
            <div className="text-green-700 font-bold text-base mt-2">{s.result}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
