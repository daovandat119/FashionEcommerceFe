
import { useState, useEffect } from 'react';

const CountDown = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const countDownDate = new Date("Dec 31, 2025 23:59:59").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-lightGray">
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-between">
                    <div className="text-left">
                        <p className="text-red-500 uppercase tracking-widest text-bold">
                            Deal of the week
                        </p>
                        <h1 className="text-6xl font-bold mt-2">
                            Spring Collection
                        </h1>
                        <a className="text-lg mt-4 inline-block border-b-2 border-black" href="#">
                            Shop Now
                        </a>
                        <div className="mt-8 flex space-x-4 text-center">
                            <div>
                                <p className="text-4xl font-bold">
                                    {timeLeft.days}
                                </p>
                                <p className="text-sm uppercase tracking-widest">
                                    Days
                                </p>
                            </div>
                            <div className="text-4xl font-bold">
                                :
                            </div>
                            <div>
                                <p className="text-4xl font-bold">
                                    {timeLeft.hours}
                                </p>
                                <p className="text-sm uppercase tracking-widest">
                                    Hours
                                </p>
                            </div>
                            <div className="text-4xl font-bold">
                                :
                            </div>
                            <div>
                                <p className="text-4xl font-bold">
                                    {timeLeft.minutes}
                                </p>
                                <p className="text-sm uppercase tracking-widest">
                                    Mins
                                </p>
                            </div>
                            <div className="text-4xl font-bold">
                                :
                            </div>
                            <div>
                                <p className="text-4xl font-bold">
                                    {timeLeft.seconds}
                                </p>
                                <p className="text-sm uppercase tracking-widest">
                                    Sec
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img alt="Gray overcoat from the spring collection" className="w-96 " src="/assets/images/cd.png" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CountDown;