export const fetchExercises = async (query) => {
    // Aquí deberías realizar la llamada a la API real
    // Este es un ejemplo con datos simulados
    const simulatedData = [
      { id: '1', name: 'Push-up' },
      { id: '2', name: 'Pull-up' },
      { id: '3', name: 'Squat' },
    ];
  
    // Filtrar los resultados simulados basados en el query
    const filteredData = simulatedData.filter(exercise =>
      exercise.name.toLowerCase().includes(query.split('=')[1].toLowerCase())
    );
  
    return filteredData;
  };
  