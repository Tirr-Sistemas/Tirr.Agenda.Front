import useScheduleNavigation from "@/hook/useNavigation";
import useGlobalContext from "@/store";
import { phoneMask } from "@/utils/maskPhone";
import { useForm } from "react-hook-form";

/**
 * =========================================================
 * Página: ProfilePage
 * =========================================================
 *
 * Etapa do fluxo de agendamento responsável por capturar
 * os dados do cliente.
 *
 * Integrações:
 * - React Hook Form (controle de formulário)
 * - Zustand (estado global parcial)
 * - Schedule Navigation (controle do fluxo)
 */
type FormData = {
  name: string;
  email: string;
  phone: string;
};

const ProfilePage = () => {
  const { schedule, updateSchedule } = useGlobalContext();
  const { next, back, isFirstPage, isLastPage } = useScheduleNavigation();

  /**
   * =====================================================
   * FORM
   * =====================================================
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      name: schedule?.name ?? "",
      email: schedule?.email ?? "",
      phone: schedule?.phone ?? "",
    },
  });

  /**
   * =====================================================
   * ON SUBMIT
   * =====================================================
   * Atualiza estado global antes de avançar no fluxo
   */
  const onSubmit = (data: FormData) => {
    updateSchedule({
      name: data.name,
      email: data.email,
      phone: data.phone,
    });

    next();
  };

  return (
    <div className="container py-5 px-3">

      {/* ================= HEADER ================= */}
      <div className="mb-2">
        <h6 className="text-muted fw-light">
          Queremos te conhecer melhor
        </h6>
      </div>

      {/* ================= FORM ================= */}
      <form
        className="d-flex flex-column gap-5 mb-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="bg-white border-0 rounded-4 px-4 py-4 d-flex flex-column gap-3">
          {/* NAME */}
          <div className="mb-3">
            <label className="form-label font-size-15">Nome</label>
            <input
              className="form-control rounded-0 border-0 tirr__profile-page__border-color border-bottom bg-white"
              placeholder="Digite seu nome"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <small className="text-danger">Nome é obrigatório</small>
            )}
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label font-size-15">Email</label>
            <input
              type="email"
              className="form-control rounded-0 tirr__profile-page__border-color  border-0 border-bottom bg-white"
              placeholder="Digite seu email"
              {...register("email", {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              })}
            />
            {errors.email && (
              <small className="text-danger">Email inválido</small>
            )}
          </div>

          {/* PHONE */}
          <div className="mb-3">
            <label className="form-label font-size-15">Telefone</label>
            <input
              type="tel" 
              className="form-control rounded-0 border-0 tirr__profile-page__border-color  border-bottom bg-white"
              placeholder="Digite seu telefone"
              {...register("phone", {
                required: true,
                minLength: 10,
                onChange: (e) => {
                  e.target.value = phoneMask(e.target.value); // Aplica a máscara em tempo real
                }
              })}
            />
            {errors.phone && (
              <small className="text-danger">
                Telefone inválido (mínimo 10 dígitos)
              </small>
            )}
          </div>

        </div>
        

        {/* ================= NAVIGATION ================= */}
        <div className="d-flex justify-content-between gap-2 fixed-bottom bg-light p-3 d-flex justify-content-end w-100 shadow-lg">

          <button
            type="button"
            className="btn btn-outline-primary w-100 p-3 font-size-17 fw-bold"
            onClick={back}
            disabled={isFirstPage}
          >
            Voltar
          </button>

          <button
            type="submit"
            className="btn btn-primary w-100 font-size-17 fw-bold"
            disabled={!isValid}
          >
            {isLastPage ? "Finalizar" : "Próximo"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default ProfilePage;