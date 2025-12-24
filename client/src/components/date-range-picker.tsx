import { useState, useEffect, useId } from "react";
import { NativeCheckbox } from "@/components/ui/native-checkbox";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  includeDateLabel?: string;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  includeDateLabel = "Añadir fecha",
}: DateRangePickerProps) {
  const baseId = useId();
  const includeDateId = `${baseId}-include-date-checkbox`;
  const startDayId = `${baseId}-start-day-select`;
  const startMonthId = `${baseId}-start-month-select`;
  const startYearId = `${baseId}-start-year-select`;
  const startHourId = `${baseId}-start-hour-select`;
  const startMinuteId = `${baseId}-start-minute-select`;
  const endDayId = `${baseId}-end-day-select`;
  const endMonthId = `${baseId}-end-month-select`;
  const endYearId = `${baseId}-end-year-select`;
  const endHourId = `${baseId}-end-hour-select`;
  const endMinuteId = `${baseId}-end-minute-select`;
  const includeStartTimeId = `${baseId}-include-start-time-checkbox`;
  const includeEndTimeId = `${baseId}-include-end-time-checkbox`;

  // Estado para fecha de inicio
  const [includeDate, setIncludeDate] = useState(false);
  const [startDay, setStartDay] = useState<string>("");
  const [startMonth, setStartMonth] = useState<string>("");
  const [startYear, setStartYear] = useState<string>("");
  const [includeStartTime, setIncludeStartTime] = useState(false);
  const [startHour, setStartHour] = useState<string>("00");
  const [startMinute, setStartMinute] = useState<string>("00");

  // Estado para fecha de fin
  const [endDay, setEndDay] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [includeEndTime, setIncludeEndTime] = useState(false);
  const [endHour, setEndHour] = useState<string>("00");
  const [endMinute, setEndMinute] = useState<string>("00");

  // Sincronizar estado local con props
  useEffect(() => {
    if (startDate || endDate) {
      setIncludeDate(true);
      
      if (startDate) {
        const d = new Date(startDate);
        setStartDay(String(d.getDate()));
        setStartMonth(String(d.getMonth() + 1));
        setStartYear(String(d.getFullYear()));
        
        if (d.getHours() !== 0 || d.getMinutes() !== 0) {
          setIncludeStartTime(true);
          setStartHour(String(d.getHours()).padStart(2, '0'));
          setStartMinute(String(d.getMinutes()).padStart(2, '0'));
        } else {
          setIncludeStartTime(false);
          setStartHour("00");
          setStartMinute("00");
        }
      }
      
      if (endDate) {
        const d = new Date(endDate);
        setEndDay(String(d.getDate()));
        setEndMonth(String(d.getMonth() + 1));
        setEndYear(String(d.getFullYear()));
        
        if (d.getHours() !== 0 || d.getMinutes() !== 0) {
          setIncludeEndTime(true);
          setEndHour(String(d.getHours()).padStart(2, '0'));
          setEndMinute(String(d.getMinutes()).padStart(2, '0'));
        } else {
          setIncludeEndTime(false);
          setEndHour("00");
          setEndMinute("00");
        }
      }
    } else {
      setIncludeDate(false);
      setStartDay("");
      setStartMonth("");
      setStartYear("");
      setIncludeStartTime(false);
      setStartHour("00");
      setStartMinute("00");
      setEndDay("");
      setEndMonth("");
      setEndYear("");
      setIncludeEndTime(false);
      setEndHour("00");
      setEndMinute("00");
    }
  }, [startDate, endDate]);

  // Actualizar fecha de inicio
  const updateStartDate = (day: string, month: string, year: string, hour: string, minute: string) => {
    if (!day || !month || !year) {
      onStartDateChange(null);
      return;
    }

    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);

    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      onStartDateChange(null);
      return;
    }

    const newDate = new Date(yearNum, monthNum - 1, dayNum, hourNum, minuteNum);
    onStartDateChange(newDate);
  };

  // Actualizar fecha de fin
  const updateEndDate = (day: string, month: string, year: string, hour: string, minute: string) => {
    if (!day || !month || !year) {
      onEndDateChange(null);
      return;
    }

    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);

    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      onEndDateChange(null);
      return;
    }

    const newDate = new Date(yearNum, monthNum - 1, dayNum, hourNum, minuteNum);
    onEndDateChange(newDate);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* Checkbox para incluir fechas */}
      <div className="flex items-center space-x-2">
        <NativeCheckbox
          id={includeDateId}
          checked={includeDate}
          onCheckedChange={(checked) => {
            setIncludeDate(checked);
            if (!checked) {
              // Limpiar todo
              setStartDay("");
              setStartMonth("");
              setStartYear("");
              setIncludeStartTime(false);
              setStartHour("00");
              setStartMinute("00");
              setEndDay("");
              setEndMonth("");
              setEndYear("");
              setIncludeEndTime(false);
              setEndHour("00");
              setEndMinute("00");
              onStartDateChange(null);
              onEndDateChange(null);
            }
          }}
          data-testid="checkbox-include-date"
        />
        <label
          htmlFor={includeDateId}
          className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {includeDateLabel}
        </label>
      </div>

      {/* Fecha de inicio */}
      {includeDate && (
        <fieldset className="space-y-3 border border-input rounded-md p-4">
          <legend className="text-sm font-medium px-2">
            Fecha de inicio
          </legend>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={startDayId} className="text-sm font-medium">
                Día
              </label>
              <select
                id={startDayId}
                value={startDay}
                onChange={(e) => {
                  setStartDay(e.target.value);
                  updateStartDate(e.target.value, startMonth, startYear, startHour, startMinute);
                }}
                className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                data-testid="select-start-day"
              >
                <option value="">--</option>
                {days.map(d => (
                  <option key={d} value={String(d)}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={startMonthId} className="text-sm font-medium">
                Mes
              </label>
              <select
                id={startMonthId}
                value={startMonth}
                onChange={(e) => {
                  setStartMonth(e.target.value);
                  updateStartDate(startDay, e.target.value, startYear, startHour, startMinute);
                }}
                className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                data-testid="select-start-month"
              >
                <option value="">--</option>
                {MONTHS.map((m, idx) => (
                  <option key={idx} value={String(idx + 1)}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={startYearId} className="text-sm font-medium">
                Año
              </label>
              <select
                id={startYearId}
                value={startYear}
                onChange={(e) => {
                  setStartYear(e.target.value);
                  updateStartDate(startDay, startMonth, e.target.value, startHour, startMinute);
                }}
                className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                data-testid="select-start-year"
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

          {/* Checkbox para hora de inicio */}
          {startDay && startMonth && startYear && (
            <div className="flex items-center space-x-2 pt-2">
              <NativeCheckbox
                id={includeStartTimeId}
                checked={includeStartTime}
                onCheckedChange={(checked) => {
                  setIncludeStartTime(checked);
                  if (!checked) {
                    setStartHour("00");
                    setStartMinute("00");
                    updateStartDate(startDay, startMonth, startYear, "00", "00");
                  }
                }}
                data-testid="checkbox-include-start-time"
              />
              <label
                htmlFor={includeStartTimeId}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Añadir hora específica
              </label>
            </div>
          )}

          {/* Selectores de hora de inicio */}
          {includeStartTime && startDay && startMonth && startYear && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label htmlFor={startHourId} className="text-sm font-medium">
                  Hora
                </label>
                <select
                  id={startHourId}
                  value={startHour}
                  onChange={(e) => {
                    setStartHour(e.target.value);
                    updateStartDate(startDay, startMonth, startYear, e.target.value, startMinute);
                  }}
                  className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                  data-testid="select-start-hour"
                >
                  {hours.map(h => (
                    <option key={h} value={String(h).padStart(2, '0')}>
                      {String(h).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={startMinuteId} className="text-sm font-medium">
                  Minutos
                </label>
                <select
                  id={startMinuteId}
                  value={startMinute}
                  onChange={(e) => {
                    setStartMinute(e.target.value);
                    updateStartDate(startDay, startMonth, startYear, startHour, e.target.value);
                  }}
                  className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                  data-testid="select-start-minute"
                >
                  {minutes.map(m => (
                    <option key={m} value={String(m).padStart(2, '0')}>
                      {String(m).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </fieldset>
      )}

      {/* Fecha de fin */}
      {includeDate && (
        <fieldset className="space-y-3 border border-input rounded-md p-4">
          <legend className="text-sm font-medium px-2">
            Fecha de fin
          </legend>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={endDayId} className="text-sm font-medium">
                Día
              </label>
              <select
                id={endDayId}
                value={endDay}
                onChange={(e) => {
                  setEndDay(e.target.value);
                  updateEndDate(e.target.value, endMonth, endYear, endHour, endMinute);
                }}
                className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                data-testid="select-end-day"
              >
                <option value="">--</option>
                {days.map(d => (
                  <option key={d} value={String(d)}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={endMonthId} className="text-sm font-medium">
                Mes
              </label>
              <select
                id={endMonthId}
                value={endMonth}
                onChange={(e) => {
                  setEndMonth(e.target.value);
                  updateEndDate(endDay, e.target.value, endYear, endHour, endMinute);
                }}
                className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                data-testid="select-end-month"
              >
                <option value="">--</option>
                {MONTHS.map((m, idx) => (
                  <option key={idx} value={String(idx + 1)}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={endYearId} className="text-sm font-medium">
                Año
              </label>
              <select
                id={endYearId}
                value={endYear}
                onChange={(e) => {
                  setEndYear(e.target.value);
                  updateEndDate(endDay, endMonth, e.target.value, endHour, endMinute);
                }}
                className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                data-testid="select-end-year"
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

          {/* Checkbox para hora de fin */}
          {endDay && endMonth && endYear && (
            <div className="flex items-center space-x-2 pt-2">
              <NativeCheckbox
                id={includeEndTimeId}
                checked={includeEndTime}
                onCheckedChange={(checked) => {
                  setIncludeEndTime(checked);
                  if (!checked) {
                    setEndHour("00");
                    setEndMinute("00");
                    updateEndDate(endDay, endMonth, endYear, "00", "00");
                  }
                }}
                data-testid="checkbox-include-end-time"
              />
              <label
                htmlFor={includeEndTimeId}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Añadir hora específica
              </label>
            </div>
          )}

          {/* Selectores de hora de fin */}
          {includeEndTime && endDay && endMonth && endYear && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label htmlFor={endHourId} className="text-sm font-medium">
                  Hora
                </label>
                <select
                  id={endHourId}
                  value={endHour}
                  onChange={(e) => {
                    setEndHour(e.target.value);
                    updateEndDate(endDay, endMonth, endYear, e.target.value, endMinute);
                  }}
                  className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                  data-testid="select-end-hour"
                >
                  {hours.map(h => (
                    <option key={h} value={String(h).padStart(2, '0')}>
                      {String(h).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={endMinuteId} className="text-sm font-medium">
                  Minutos
                </label>
                <select
                  id={endMinuteId}
                  value={endMinute}
                  onChange={(e) => {
                    setEndMinute(e.target.value);
                    updateEndDate(endDay, endMonth, endYear, endHour, e.target.value);
                  }}
                  className="w-full text-base border border-input rounded-md px-3 py-2 bg-background"
                  data-testid="select-end-minute"
                >
                  {minutes.map(m => (
                    <option key={m} value={String(m).padStart(2, '0')}>
                      {String(m).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </fieldset>
      )}
    </div>
  );
}
