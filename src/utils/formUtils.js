/**
 * Formata um valor como CPF (###.###.###-##) ou CNPJ (##.###.###/####-##)
 * enquanto o usuário digita.
 */
export const formatCpfCnpj = (value) => {
  if (!value) return "";
  const onlyNums = value.replace(/[^\d]/g, "");

  if (onlyNums.length <= 11) {
    // Formato CPF
    return onlyNums
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // Formato CNPJ
    return onlyNums
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
};

/**
 * Formata um valor como CNH (apenas 11 dígitos numéricos).
 */
export const formatCnh = (value) => {
  if (!value) return "";
  return value.replace(/[^\d]/g, "").slice(0, 11);
};

/**
 * Valida se um valor tem 11 dígitos (CPF) ou 14 dígitos (CNPJ).
 * Nota: Esta é uma validação simples baseada no comprimento e não valida os dígitos verificadores.
 * @param {string} value - O valor de CPF/CNPJ não formatado (apenas números).
 * @returns {boolean}
 */
export const validateCpfCnpj = (value) => {
  if (!value) return false;
  const cleaned = value.replace(/[^\d]/g, "");

  if (cleaned.length === 11 || cleaned.length === 14) {
    // Impede sequências de dígitos repetidos (ex: 111.111.111-11)
    if (/^(\d)\1+$/.test(cleaned)) return false;
    return true;
  }

  return false;
};

/**
 * Valida se a CNH possui 11 dígitos.
 * @param {string} value - O valor da CNH não formatado (apenas números).
 * @returns {boolean}
 */
export const validateCnh = (cnh) => {
  if (!cnh) return false;
  const cleaned = cnh.replace(/[^\d]/g, "");
  return cleaned.length === 11;
};
