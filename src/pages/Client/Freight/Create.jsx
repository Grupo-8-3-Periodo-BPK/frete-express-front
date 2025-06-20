import React, { useState, useEffect } from "react";
import { useTheme, useAuth } from "../../../contexts/AuthContext"; // Seus imports existentes
import { motion } from "framer-motion";
import Alert from "../../../components/ui/modal/Alert";
import { useNavigate } from "react-router-dom";
import {
  createFreight,
  getIBGECities,
  getIBGECitiesByState,
} from "../../../services/freight";

// --- COMPONENTE PRINCIPAL ---
function CreateFreight() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    message: "",
    type: "success",
    isAlertOpen: false,
  });

  const [freight, setFreight] = useState({
    name: "",
    price: "",
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
  const [loading, setLoading] = useState(false);

  const [states, setStates] = useState([]);
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);

  useEffect(() => {
    getIBGECities()
      .then((data) => setStates(data))
      .catch((error) => console.error("Erro ao buscar estados:", error));
  }, []);

  useEffect(() => {
    if (freight.origin_state) {
      setOriginCities([]);
      getIBGECitiesByState(freight.origin_state)
        .then((data) => setOriginCities(data))
        .catch((error) => console.error("Erro ao buscar cidades:", error));
    }
  }, [freight.origin_state]);

  useEffect(() => {
    if (freight.destination_state) {
      setDestinationCities([]);
      getIBGECitiesByState(freight.destination_state)
        .then((data) => setDestinationCities(data))
        .catch((error) => console.error("Erro ao buscar cidades:", error));
    }
  }, [freight.destination_state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "origin_state")
      setFreight((prev) => ({ ...prev, origin_city: "" }));
    if (name === "destination_state")
      setFreight((prev) => ({ ...prev, destination_city: "" }));

    setFreight((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    if (numericValue === "") {
      setFreight((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    const numberValue = Number(numericValue) / 100;
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numberValue);
    setFreight((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let v = value.replace(/\D/g, "").slice(0, 8);
    if (v.length > 4) v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    else if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
    setFreight((prev) => ({ ...prev, [name]: v }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(freight).forEach((key) => {
      if (!freight[key]) newErrors[key] = "Campo obrigatório";
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    if (!user.id) {
      setAlert({
        message: "Usuário não autenticado.",
        type: "error",
        isAlertOpen: true,
      });
      setLoading(false);
      return;
    }

    const freightData = {
      ...freight,
      price: parseFloat(freight.price.replace(/[^\d,]/g, "").replace(",", ".")),
      initial_date: freight.initial_date.split("/").reverse().join("-"),
      final_date: freight.final_date.split("/").reverse().join("-"),
    };

    delete freightData.user_id;

    try {
      const savedFreight = await createFreight(freightData);

      if (savedFreight) {
        setAlert({
          message: "Frete cadastrado com sucesso!",
          type: "success",
          isAlertOpen: true,
          navigateTo: "/client/freights",
        });
      } else {
        setAlert({
          message: "Erro desconhecido ao cadastrar o frete.",
          type: "error",
          isAlertOpen: true,
        });
      }
    } catch (err) {
      setAlert({
        message: err.message || "Erro ao cadastrar o frete.",
        type: "error",
        isAlertOpen: true,
      });
    } finally {
      setLoading(false);
    }
  };

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
    label: {
      color: darkMode ? "white" : "#4B5563",
      display: "block",
      marginBottom: "0.5rem",
      fontSize: "0.875rem",
      fontWeight: "500",
    },
    heading: {
      color: darkMode ? "white" : "#1f2937",
      borderColor: darkMode ? "#4B5563" : "#e5e7eb",
      fontSize: "1.125rem",
      fontWeight: "500",
      marginBottom: "0.75rem",
      borderBottomWidth: "1px",
      paddingBottom: "0.5rem",
    },
    cancelBtn: {
      backgroundColor: darkMode ? "#374151" : "#f3f4f6",
      color: darkMode ? "#e5e7eb" : "#4B5563",
      borderColor: darkMode ? "#4B5563" : "#d1d5db",
    },
    errorText: "text-red-500 text-sm mt-1",
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-1 dark:border-gray-200`;
  const errorInputClasses = "border-2 border-red-500";

  return (
    <div className="min-h-screen" style={style.page}>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden"
          style={style.container}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h1 className="text-white text-2xl font-bold">
              Cadastrar Novo Frete
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
              <div className="md:col-span-2">
                <label style={style.label}>Nome do produto</label>
                <input
                  name="name"
                  value={freight.name}
                  onChange={handleChange}
                  className={`${inputClasses} ${
                    errors.name && errorInputClasses
                  }`}
                  style={style.input}
                />
                {errors.name && (
                  <p className={style.errorText}>{errors.name}</p>
                )}
              </div>

              <div>
                <label style={style.label}>Preço</label>
                <input
                  name="price"
                  value={freight.price}
                  onChange={handlePriceChange}
                  placeholder="R$ 0,00"
                  className={`${inputClasses} ${
                    errors.price && errorInputClasses
                  }`}
                  style={style.input}
                />
                {errors.price && (
                  <p className={style.errorText}>{errors.price}</p>
                )}
              </div>

              <div className="md:col-span-3">
                <h3 style={style.heading}>Origem</h3>
              </div>
              <div>
                <label style={style.label}>Estado</label>
                <select
                  name="origin_state"
                  value={freight.origin_state}
                  onChange={handleChange}
                  className={`${inputClasses} ${
                    errors.origin_state && errorInputClasses
                  }`}
                  style={style.input}
                >
                  <option value="">Selecione...</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.sigla}>
                      {s.nome}
                    </option>
                  ))}
                </select>
                {errors.origin_state && (
                  <p className={style.errorText}>{errors.origin_state}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label style={style.label}>Cidade</label>
                <select
                  name="origin_city"
                  value={freight.origin_city}
                  onChange={handleChange}
                  disabled={!freight.origin_state}
                  className={`${inputClasses} ${
                    errors.origin_city && errorInputClasses
                  }`}
                  style={style.input}
                >
                  <option value="">Selecione um estado primeiro</option>
                  {originCities.map((c) => (
                    <option key={c.id} value={c.nome}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                {errors.origin_city && (
                  <p className={style.errorText}>{errors.origin_city}</p>
                )}
              </div>

              <div className="md:col-span-3">
                <h3 style={style.heading}>Destino</h3>
              </div>
              <div>
                <label style={style.label}>Estado</label>
                <select
                  name="destination_state"
                  value={freight.destination_state}
                  onChange={handleChange}
                  className={`${inputClasses} ${
                    errors.destination_state && errorInputClasses
                  }`}
                  style={style.input}
                >
                  <option value="">Selecione...</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.sigla}>
                      {s.nome}
                    </option>
                  ))}
                </select>
                {errors.destination_state && (
                  <p className={style.errorText}>{errors.destination_state}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label style={style.label}>Cidade</label>
                <select
                  name="destination_city"
                  value={freight.destination_city}
                  onChange={handleChange}
                  disabled={!freight.destination_state}
                  className={`${inputClasses} ${
                    errors.destination_city && errorInputClasses
                  }`}
                  style={style.input}
                >
                  <option value="">Selecione um estado primeiro</option>
                  {destinationCities.map((c) => (
                    <option key={c.id} value={c.nome}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                {errors.destination_city && (
                  <p className={style.errorText}>{errors.destination_city}</p>
                )}
              </div>

              <div className="md:col-span-3">
                <h3 style={style.heading}>Medidas e Prazos</h3>
              </div>
              {Object.entries({
                weight: "Peso (kg)",
                height: "Altura (cm)",
                width: "Largura (cm)",
                length: "Comprimento (cm)",
              }).map(([name, label]) => (
                <div key={name}>
                  <label style={style.label}>{label}</label>
                  <input
                    name={name}
                    type="number"
                    value={freight[name]}
                    onChange={handleChange}
                    className={`${inputClasses} ${
                      errors[name] && errorInputClasses
                    }`}
                    style={style.input}
                  />
                  {errors[name] && (
                    <p className={style.errorText}>{errors[name]}</p>
                  )}
                </div>
              ))}

              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label style={style.label}>Data de Início</label>
                  <input
                    name="initial_date"
                    value={freight.initial_date}
                    onChange={handleDateChange}
                    placeholder="DD/MM/AAAA"
                    className={`${inputClasses} ${
                      errors.initial_date && errorInputClasses
                    }`}
                    style={style.input}
                  />
                  {errors.initial_date && (
                    <p className={style.errorText}>{errors.initial_date}</p>
                  )}
                </div>
                <div>
                  <label style={style.label}>Data de Entrega</label>
                  <input
                    name="final_date"
                    value={freight.final_date}
                    onChange={handleDateChange}
                    placeholder="DD/MM/AAAA"
                    className={`${inputClasses} ${
                      errors.final_date && errorInputClasses
                    }`}
                    style={style.input}
                  />
                  {errors.final_date && (
                    <p className={style.errorText}>{errors.final_date}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-lg cursor-pointer border"
                style={style.cancelBtn}
                onClick={() => navigate(-1)}
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar Frete"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
      <Alert
        message={alert.message}
        isAlertOpen={alert.isAlertOpen}
        setIsAlertOpen={setAlert}
        navigateTo={alert.type === "success" && alert.navigateTo}
        type={alert.type}
      />
    </div>
  );
}

export default CreateFreight;
