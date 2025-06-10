import React, { useState } from "react";
import { useTheme } from "../../../contexts/AuthContext";
import { motion } from "motion/react";
import Alert from "../../../components/ui/modal/Alert";
import { useNavigate } from "react-router-dom";
import { createFreight } from "../../../services/freight";

// Componentes simplificados
const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-2" style={props.style.label}>
      {label}
    </label>
    <input
      className="w-full px-4 py-3 rounded-lg focus:outline-none dark:border-1 dark:border-gray-200"
      style={props.style.input}
      required
      autoComplete="off"
      {...props}
    />
    {props.error && <p className="text-red-500 text-sm mt-1">{props.error}</p>}
  </div>
);

const Section = ({ title, children, style }) => (
  <>
    <div className="md:col-span-3">
      <h3
        className="text-lg font-medium mb-3 border-b pb-2"
        style={style.heading}
      >
        {title}
      </h3>
    </div>
    {children}
  </>
);

function CreateFreight() {
  const { darkMode } = useTheme();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [navigateTo, setNavigateTo] = useState("");
  const navigate = useNavigate();
  const [freight, setFreight] = useState({
    name: "",
    weight: "",
    height: "",
    width: "",
    length: "",
    origin_city: "",
    origin_state: "",
    destination_city: "",
    destination_state: "",
    initial_date: "",
    final_date: "",
  });
  const [errors, setErrors] = useState({});

  // Estilos
  const style = {
    page: { backgroundColor: darkMode ? "#111827" : "#f3f4f6" },
    container: {
      backgroundColor: darkMode ? "#1f2937" : "white",
      color: darkMode ? "white" : "#1f2937",
    },
    input: {
      backgroundColor: darkMode ? "#374151" : "#f9fafb",
      color: darkMode ? "white" : "#1f2937",
      borderColor: darkMode ? "#4B5563" : "#e5e7eb",
    },
    label: { color: darkMode ? "white" : "#4B5563" },
    heading: {
      color: darkMode ? "white" : "#1f2937",
      borderColor: darkMode ? "#4B5563" : "#e5e7eb",
    },
    cancelBtn: {
      backgroundColor: darkMode ? "#374151" : "#f3f4f6",
      color: darkMode ? "#e5e7eb" : "#4B5563",
      borderColor: darkMode ? "#4B5563" : "#d1d5db",
    },
  };

  // Handler unificado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFreight((prev) => ({ ...prev, [name]: value }));
  };

  // Handler para datas
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let numericValue = value.replace(/\D/g, "");
    let formattedValue = numericValue;

    if (numericValue.length > 2)
      formattedValue = numericValue.slice(0, 2) + "/" + numericValue.slice(2);
    if (numericValue.length > 4)
      formattedValue =
        formattedValue.slice(0, 5) + "/" + numericValue.slice(4, 8);
    if (formattedValue.length > 10)
      formattedValue = formattedValue.slice(0, 10);

    let error = null;
    if (formattedValue.length === 10) {
      const [day, month, year] = formattedValue.split("/").map(Number);
      const currentYear = new Date().getFullYear();

      if (month < 1 || month > 12) error = "Mês inválido";
      else if (day < 1 || day > new Date(year, month, 0).getDate())
        error = "Dia inválido";
      else if (year < currentYear - 1 || year > currentYear + 10)
        error = "Ano inválido";

      if (
        !error &&
        name === "final_date" &&
        freight.initial_date.length === 10
      ) {
        const [sDay, sMonth, sYear] = freight.initial_date
          .split("/")
          .map(Number);
        const startDate = new Date(sYear, sMonth - 1, sDay);
        const endDate = new Date(year, month - 1, day);
        if (startDate > endDate) error = "Data final deve ser após a inicial";
      }
    }

    setFreight((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Cria uma cópia do objeto para não modificar o estado original
    const freightData = { ...freight };

    // Converter datas do formato DD/MM/YYYY para YYYY-MM-DD
    if (freightData.initial_date) {
      const [day, month, year] = freightData.initial_date.split("/");
      freightData.initial_date = `${year}-${month}-${day}`;
    }

    if (freightData.final_date) {
      const [day, month, year] = freightData.final_date.split("/");
      freightData.final_date = `${year}-${month}-${day}`;
    }

    setLoading(true);
    try {
      const response = await createFreight(freightData);
      if (response.status === 201) {
        setMessage("Frete cadastrado com sucesso");
        setAlertType("success");
        setIsAlertOpen(true);
        setNavigateTo("/freights");
      } else {
        setMessage(response.data?.message || "Erro ao cadastrar frete");
        setAlertType("error");
        setIsAlertOpen(true);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Erro ao cadastrar frete");
      setAlertType("error");
      setIsAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={style.page}>
      <div className="container mx-auto px-4 py-12">
        <div
          className="max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden"
          style={style.container}
        >
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h1 className="text-white text-2xl font-bold">
              Cadastrar Novo Frete
            </h1>
            <p className="text-blue-100 mt-1 opacity-80">
              Preencha os dados do produto para calcular o frete
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-8" style={style.container}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Nome do produto"
                  name="name"
                  value={freight.name}
                  onChange={handleChange}
                  placeholder="Ex: Smartphone Galaxy S22"
                  style={style}
                />
              </div>

              <Input
                label="Peso total (kg)"
                name="weight"
                type="number"
                value={freight.weight}
                onChange={handleChange}
                placeholder="Ex: 0.5"
                step="0.01"
                style={style}
              />

              {/* Dimensões */}
              <Section title="Dimensões" style={style}>
                {["height", "width", "length"].map((field, i) => (
                  <Input
                    key={field}
                    label={["Altura (cm)", "Largura (cm)", "Comprimento (cm)"][i]}
                    name={field}
                    type="number"
                    value={freight[field]}
                    onChange={handleChange}
                    placeholder={["Ex: 15", "Ex: 8", "Ex: 20"][i]}
                    style={style}
                  />
                ))}
              </Section>

              {/* Prazos */}
              <Section title="Prazos" style={style}>
                <Input
                  label="Data de início"
                  name="initial_date"
                  value={freight.initial_date}
                  onChange={handleDateChange}
                  placeholder="DD/MM/AAAA"
                  error={errors.initial_date}
                  style={style}
                />
                <Input
                  label="Data de entrega"
                  name="final_date"
                  value={freight.final_date}
                  onChange={handleDateChange}
                  placeholder="DD/MM/AAAA"
                  error={errors.final_date}
                  style={style}
                />
              </Section>

              {/* Endereços */}
              <Section title="Endereços" style={style}>
                <div className="md:col-span-3">
                  <Input
                    label="Cidade de origem"
                    name="origin_city"
                    value={freight.origin_city}
                    onChange={handleChange}
                    placeholder="Ex: São Paulo"
                    style={style}
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    label="Estado de origem"
                    name="origin_state"
                    value={freight.origin_state}
                    onChange={handleChange}
                    placeholder="Ex: SP"
                    style={style}
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    label="Cidade de destino"
                    name="destination_city"
                    value={freight.destination_city}
                    onChange={handleChange}
                    placeholder="Ex: Rio de Janeiro"
                    style={style}
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    label="Estado de destino"
                    name="destination_state"
                    value={freight.destination_state}
                    onChange={handleChange}
                    placeholder="Ex: RJ"
                    style={style}
                  />
                </div>
              </Section>
            </div>

            {/* Botões */}
            <div className="mt-8 flex justify-end space-x-4">
              <motion.button
                type="button"
                whileHover={{
                  backgroundColor: darkMode ? "#4B5563" : "#d1d5db",
                }}
                className="px-6 py-3 rounded-lg cursor-pointer border"
                style={style.cancelBtn}
                onClick={() => window.history.back()}
              >
                Cancelar
              </motion.button>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg !bg-gradient-to-r !from-blue-600 !to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-200 cursor-pointer"
              >
                Cadastrar Frete
              </button>
            </div>
          </form>
        </div>
      </div>
      <Alert
        message={message}
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        navigateTo={"/freights"}
        type={alertType}
      />
    </div>
  );
}

export default CreateFreight;
