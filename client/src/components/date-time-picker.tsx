import { useState, useEffect, useId } from "react";
import { FormLabel } from "@/components/ui/form";
import { NativeCheckbox } from "@/components/ui/native-checkbox";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  dateLabel?: string;
  timeLabel?: string;
  includeTimeLabel?: string;
  includeDateLabel?: string;
  dateHintText?: string;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function DateTimePicker({
  value,
  onChange,
  dateLabel = "Fecha de vencimiento",
  timeLabel = "Hora",
  includeTimeLabel = "Añadir hora específica",
  includeDateLabel = "Añadir fecha de vencimiento",
  dateHintText = "Selecciona día, mes y año"
}: DateTimePickerProps) {
  // Generate unique IDs for this instance
  const baseId = useId();
  const includeDateId = `${baseId}-include-date-checkbox`;
  const dayId = `${baseId}-day-select`;
  const monthId = `${baseId}-month-select`;
  const yearId = `${baseId}-year-select`;
  const includeTimeId = `${baseId}-include-time-checkbox`;
  const hourId = `${baseId}-hour-select`;
  const minuteId = `${baseId}-minute-select`;
  const dateHintId = `${baseId}-date-hint`;
  const timeHintId = `${baseId}-time-hint`;

  // Estado local para los selectores
  const [includeDate, setIncludeDate] = useState(false);
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [includeTime, setIncludeTime] = useState(false);
  const [hour, setHour] = useState<string>("00");
  const [minute, setMinute] = useState<string>("00");

  // Sincronizar estado local con el valor prop
  useEffect(() => {
    if (value) {
      setIncludeDate(true);
      const d = new Date(value);
      setDay(String(d.getDate()));
      setMonth(String(d.getMonth() + 1));
      setYear(String(d.getFullYear()));
      
      // Si tiene hora diferente a medianoche, mostrar selector de hora
      if (d.getHours() !== 0 || d.getMinutes() !== 0) {
        setIncludeTime(true);
        setHour(String(d.getHours()).padStart(2, '0'));
        setMinute(String(d.getMinutes()).padStart(2, '0'));
      } else {
        setIncludeTime(false);
        setHour("00");
        setMinute("00");
      }
    } else {
      setIncludeDate(false);
      setDay("");
      setMonth("");
      setYear("");
      setIncludeTime(false);
      setHour("00");
      setMinute("00");
    }
  }, [value]);

  // Actualizar el valor cuando cambien los selectores
  const updateDate = (newDay: string, newMonth: string, newYear: string, newHour: string, newMinute: string) => {
    if (!newDay || !newMonth || !newYear) {
      onChange(null);
      return;
    }

    const dayNum = parseInt(newDay);
    const monthNum = parseInt(newMonth);
    const yearNum = parseInt(newYear);
    const hourNum = parseInt(newHour);
    const minuteNum = parseInt(newMinute);

    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      onChange(null);
      return;
    }

    const newDate = new Date(yearNum, monthNum - 1, dayNum, hourNum, minuteNum);
    onChange(newDate);
  };

  // Generar años (año actual - 1 hasta año actual + 5)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 1 + i);

  // Generar días (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Generar horas (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generar minutos (0-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* Checkbox para incluir fecha */}
      <div className="flex items-center space-x-2">
        <NativeCheckbox
          id={includeDateId}
          checked={includeDate}
          onCheckedChange={(checked) => {
            setIncludeDate(checked);
            if (!checked) {
              // Si desmarcamos, limpiar todo y devolver null
              setDay("");
              setMonth("");
              setYear("");
              setIncludeTime(false);
              setHour("00");
              setMinute("00");
              onChange(null);
            }
          }}
          data-testid="checkbox-include-date"
        />
        <label
          htmlFor={includeDateId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {includeDateLabel}
        </label>
      </div>

      {/* Selectores de fecha (solo si includeDate está marcado) */}
      {includeDate && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">
            {dateLabel}
          </legend>
          {dateHintText && (
            <p className="text-sm text-muted-foreground" id={dateHintId}>
              {dateHintText}
            </p>
          )}
          
          <div className="grid grid-cols-3 gap-3">
          {/* Día */}
          <div>
            <FormLabel htmlFor={dayId} className="text-sm">
              Día
            </FormLabel>
            <select
              id={dayId}
              value={day}
              onChange={(e) => {
                setDay(e.target.value);
                updateDate(e.target.value, month, year, hour, minute);
              }}
              className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
              data-testid="select-day"
              aria-describedby={dateHintId}
            >
              <option value="">--</option>
              {days.map(d => (
                <option key={d} value={String(d)}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Mes */}
          <div>
            <FormLabel htmlFor={monthId} className="text-sm">
              Mes
            </FormLabel>
            <select
              id={monthId}
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                updateDate(day, e.target.value, year, hour, minute);
              }}
              className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
              data-testid="select-month"
              aria-describedby={dateHintId}
            >
              <option value="">--</option>
              {MONTHS.map((m, idx) => (
                <option key={idx} value={String(idx + 1)}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Año */}
          <div>
            <FormLabel htmlFor={yearId} className="text-sm">
              Año
            </FormLabel>
            <select
              id={yearId}
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                updateDate(day, month, e.target.value, hour, minute);
              }}
              className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
              data-testid="select-year"
              aria-describedby={dateHintId}
            >
              <option value="">--</option>
              {years.map(y => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        </fieldset>
      )}

      {/* Checkbox para incluir hora */}
      {includeDate && day && month && year && (
        <div className="flex items-center space-x-2">
          <NativeCheckbox
            id={includeTimeId}
            checked={includeTime}
            onCheckedChange={(checked) => {
              setIncludeTime(checked);
              if (!checked) {
                // Si desmarcamos, resetear a medianoche
                setHour("00");
                setMinute("00");
                updateDate(day, month, year, "00", "00");
              }
            }}
            data-testid="checkbox-include-time"
          />
          <label
            htmlFor={includeTimeId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {includeTimeLabel}
          </label>
        </div>
      )}

      {/* Selectores de hora (solo si includeTime está marcado) */}
      {includeDate && includeTime && day && month && year && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium">
            {timeLabel}
          </legend>
          <p className="text-sm text-muted-foreground" id={timeHintId}>
            Selecciona hora y minutos
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Hora */}
            <div>
              <FormLabel htmlFor={hourId} className="text-sm">
                Hora
              </FormLabel>
              <select
                id={hourId}
                value={hour}
                onChange={(e) => {
                  setHour(e.target.value);
                  updateDate(day, month, year, e.target.value, minute);
                }}
                className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                data-testid="select-hour"
                aria-describedby={timeHintId}
              >
                {hours.map(h => (
                  <option key={h} value={String(h).padStart(2, '0')}>
                    {String(h).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>

            {/* Minutos */}
            <div>
              <FormLabel htmlFor={minuteId} className="text-sm">
                Minutos
              </FormLabel>
              <select
                id={minuteId}
                value={minute}
                onChange={(e) => {
                  setMinute(e.target.value);
                  updateDate(day, month, year, hour, e.target.value);
                }}
                className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                data-testid="select-minute"
                aria-describedby={timeHintId}
              >
                {minutes.map(m => (
                  <option key={m} value={String(m).padStart(2, '0')}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>
      )}
    </div>
  );
}
