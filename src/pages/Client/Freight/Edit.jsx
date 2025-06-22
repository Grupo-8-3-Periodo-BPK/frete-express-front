import React, { useState, useEffect } from "react";
import { useTheme, useAuth } from "../../../contexts/AuthContext";
import { motion } from "framer-motion";
import Alert from "../../../components/ui/modal/Alert";
import { useNavigate, useParams } from "react-router-dom";
import {
  updateFreight,
  getFreightById,
  getIBGECities,
  getIBGECitiesByState,
  deleteFreight,
} from "../../../services/freight";
import Loading from "../../../components/ui/modal/Loading";
import Confirmation from "../../../components/ui/modal/Confirmation";

function EditFreight() {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [pageLoading, setPageLoading] = useState(true);

  const [states, setStates] = useState([]);
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Carrega dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Carrega estados
        const statesData = await getIBGECities();
        setStates(statesData);

        // Carrega dados do frete
        if (id) {
          const freightData = await getFreightById(id);

          if (freightData.status !== "AVAILABLE") {
            setIsLocked(true);
          }

          // Formata os dados para o formulário
          setFreight({
            name: freightData.name || "",
            price: formatCurrencyFromNumber(freightData.price),
            weight: freightData.weight?.toString() || "",
            height: freightData.height?.toString() || "",
            width: freightData.width?.toString() || "",
            length: freightData.length?.toString() || "",
            origin_city: freightData.origin_city || "",
            origin_state: freightData.origin_state || "",
            destination_city: freightData.destination_city || "",
            destination_state: freightData.destination_state || "",
            initial_date: formatDateFromAPI(freightData.initial_date),
            final_date: formatDateFromAPI(freightData.final_date),
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setAlert({
          message: "Erro ao carregar dados",
          type: "error",
          isAlertOpen: true,
        });
      } finally {
        setPageLoading(false);
      }
    };

    loadInitialData();
  }, [id]);

  // Carrega cidades da origem quando estado muda
  useEffect(() => {
    if (freight.origin_state) {
      getIBGECitiesByState(freight.origin_state)
        .then((data) => setOriginCities(data))
        .catch((error) => console.error("Erro ao buscar cidades:", error));
    }
  }, [freight.origin_state]);

  // Carrega cidades do destino quando estado muda
  useEffect(() => {
    if (freight.destination_state) {
      getIBGECitiesByState(freight.destination_state)
        .then((data) => setDestinationCities(data))
        .catch((error) => console.error("Erro ao buscar cidades:", error));
    }
  }, [freight.destination_state]);

  // Funções auxiliares
  const formatCurrencyFromNumber = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDateFromAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "origin_state") {
      setFreight((prev) => ({ ...prev, origin_city: "" }));
    }
    if (name === "destination_state") {
      setFreight((prev) => ({ ...prev, destination_city: "" }));
    }

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

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);
    setLoading(true);
    try {
      await deleteFreight(id);
      setAlert({
        message: "Frete removido com sucesso!",
        type: "success",
        isAlertOpen: true,
        navigateTo: "/client/freights",
      });
    } catch (err) {
      setAlert({
        message: err.message || "Ocorreu um erro ao remover o frete.",
        type: "error",
        isAlertOpen: true,
      });
    } finally {
      setLoading(false);
    }
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

    const freightData = {
      ...freight,
      price: parseFloat(freight.price.replace(/[^\d,]/g, "").replace(",", ".")),
      weight: parseFloat(freight.weight),
      height: parseFloat(freight.height),
      width: parseFloat(freight.width),
      length: parseFloat(freight.length),
      initial_date: freight.initial_date.split("/").reverse().join("-"),
      final_date: freight.final_date.split("/").reverse().join("-"),
    };

    try {
      await updateFreight(id, freightData);
      setAlert({
        message: "Frete atualizado com sucesso!",
        type: "success",
        isAlertOpen: true,
        navigateTo: `/client/freight/${id}`,
      });
    } catch (err) {
      setAlert({
        message: err.message || "Erro ao atualizar o frete.",
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

  if (pageLoading) {
    return (
      <div className="min-h-screen" style={style.page}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse">
              <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-t-xl"></div>
              <div className="p-8 space-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-full h-12 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Loading isOpen={pageLoading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={style.page}>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto rounded-xl shadow-2xl overflow-hidden"
          style={style.container}
        >
          <div className="p-6 rounded-t-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <h1 className="text-2xl font-bold">Editar Frete</h1>
            <p className="text-blue-200">ID: #{id}</p>
            {isLocked && (
              <p className="mt-2 p-3 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm border border-yellow-500/30">
                Este frete não pode ser editado pois já não está mais disponível
                para propostas.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-8" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
              <div className="md:col-span-2">
                <label style={style.label}>Nome do produto</label>
                <input
                  name="name"
                  value={freight.name}
                  onChange={handleChange}
                  disabled={isLocked}
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
                  disabled={isLocked}
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
                  disabled={isLocked}
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
                  disabled={!freight.origin_state || isLocked}
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
                  disabled={isLocked}
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
                  disabled={!freight.destination_state || isLocked}
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
                    disabled={isLocked}
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
                    disabled={isLocked}
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
                    disabled={isLocked}
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

            <div className="mt-8 flex justify-between items-center px-8 py-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLocked}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Excluir Frete
              </button>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(`/client/freight/${id}`)}
                  className={`px-6 py-3 rounded-lg font-semibold border transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || isLocked}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? "Salvando..." : "Atualizar Frete"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      <Confirmation
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja remover este frete? A ação não pode ser desfeita."
      />

      <Alert
        message={alert.message}
        isAlertOpen={alert.isAlertOpen}
        setIsAlertOpen={(isOpen) => setAlert({ ...alert, isAlertOpen: isOpen })}
        navigateTo={alert.type === "success" && alert.navigateTo}
        type={alert.type}
      />
      <Loading isOpen={loading} />
    </div>
  );
}

export default EditFreight;
