import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Типы данных
interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface ParamEditorProps {
  params: Param[];
  model: Model;
}

const ParamEditor: React.FC<ParamEditorProps> = ({ params, model }) => {
  const [paramValues, setParamValues] = useState<ParamValue[]>(model.paramValues);

  const handleParamValueChange = (paramId: number, value: string) => {
    setParamValues((prevParamValues) =>
      prevParamValues.map((pv) =>
        pv.paramId === paramId ? { ...pv, value } : pv
      )
    );
  };

  return (
    <div>
      {params.map((param) => (
        <div key={param.id}>
          <label htmlFor={`param-${param.id}`}>{param.name}:</label>
          <input
            id={`param-${param.id}`}
            type="text"
            value={
              paramValues.find((pv) => pv.paramId === param.id)?.value || ''
            }
            onChange={(e) => handleParamValueChange(param.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [params, setParams] = useState<Param[]>([]);
  const [model, setModel] = useState<Model>({ paramValues: [], colors: [] });

  useEffect(() => {
    const fetchData = async () => {
      const paramsResponse = await fetch('/params.json');
      const paramsData = await paramsResponse.json();
      setParams(paramsData);

      const modelResponse = await fetch('/model.json');
      const modelData = await modelResponse.json();
      setModel(modelData);
    };
    fetchData();
  }, []);

  const handleModelChange = (newModel: Model) => {
    setModel(newModel);
  };

  const getModel = (): Model => ({
    paramValues: model.paramValues,
    colors: model.colors,
  });

  return (
    <div>
      <ParamEditor params={params} model={model} />
      <button onClick={() => handleModelChange(getModel())}>Get Model</button>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);