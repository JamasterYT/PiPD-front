import React, { useState } from "react";
import { Button } from "antd";

const TimeFetcher = () => {
  const [time, setTime] = useState<number | null>(null);

  const fetchTime = async () => {
    const response = await fetch("http://159.69.183.243:3000/api/time");
    const data = await response.json();
    setTime(data.time);
  };

  return (
    <div>
      <Button type="primary" onClick={fetchTime}>
        Pobierz czas
      </Button>
      {time !== null && <p>Czas: {time}</p>}
    </div>
  );
};

export default TimeFetcher;
