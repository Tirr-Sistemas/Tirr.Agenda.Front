import { useForm } from "react-hook-form";

import useScheduleNavigation from "@/hook/useNavigation";
import BookingSummary from "@/shared/BookingSummary";
import FixedActionBar from "@/shared/FixedActionBar";
import FormField from "@/shared/FormField";
import SchedulerPageHeader from "@/shared/SchedulerPageHeader";
import useGlobalContext from "@/store";
import { phoneMask } from "@/utils/maskPhone";

type FormData = {
  name: string;
  email: string;
  phone: string;
};

const ProfilePage = () => {
  const { schedule, updateSchedule } = useGlobalContext();
  const { next, back } = useScheduleNavigation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      name: schedule.name ?? "",
      email: schedule.email ?? "",
      phone: schedule.phone ?? "",
    },
  });

  const onSubmit = (data: FormData) => {
    updateSchedule({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone,
    });
    next();
  };

  return (
    <div className="tirr__scheduler-page">
      <SchedulerPageHeader
        eyebrow="Etapa 3"
        title="Seus dados"
        description="Informe seus dados para que possamos confirmar o agendamento."
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="tirr__scheduler-content-grid">
          <section className="tirr__scheduler-panel tirr__scheduler-form-panel" aria-labelledby="profile-form-title">
            <div className="tirr__scheduler-panel-heading">
              <p>Contato</p>
              <h2 id="profile-form-title">Como podemos falar com voce?</h2>
            </div>

            <div className="tirr__scheduler-form-fields">
              <FormField
                id="schedule-name"
                label="Nome completo"
                placeholder="Digite seu nome"
                autoComplete="name"
                error={errors.name?.message}
                {...register("name", {
                  required: "Informe seu nome completo.",
                  minLength: {
                    value: 3,
                    message: "Use pelo menos 3 caracteres.",
                  },
                })}
              />

              <FormField
                id="schedule-email"
                label="Email"
                type="email"
                placeholder="voce@exemplo.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Informe seu email.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Informe um email valido.",
                  },
                })}
              />

              <FormField
                id="schedule-phone"
                label="Telefone"
                type="tel"
                placeholder="(00) 00000-0000"
                autoComplete="tel"
                inputMode="tel"
                error={errors.phone?.message}
                {...register("phone", {
                  required: "Informe seu telefone.",
                  validate: (value) => {
                    const digits = value.replace(/\D/g, "");
                    return (digits.length >= 10 && digits.length <= 11) || "Informe um telefone valido.";
                  },
                  onChange: (event) => {
                    event.target.value = phoneMask(event.target.value);
                  },
                })}
              />
            </div>
          </section>

          <BookingSummary schedule={schedule} />
        </div>

        <FixedActionBar>
          <button className="btn btn-outline-primary" type="button" onClick={back}>
            <i className="bi bi-arrow-left" aria-hidden="true" /> Voltar
          </button>
          <button className="btn btn-primary" type="submit">
            Revisar agendamento <i className="bi bi-arrow-right" aria-hidden="true" />
          </button>
        </FixedActionBar>
      </form>
    </div>
  );
};

export default ProfilePage;
