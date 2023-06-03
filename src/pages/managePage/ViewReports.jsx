import React, { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { API } from "aws-amplify";
import { changeLoading } from "../../redux/users/productSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewReports = (props) => {
    // const { fgStorage } = props;
    const [input, setInput] = useState({
        electricity: 0,
        cutton_fibres: 0,
        bleach: 0,
        waste_water: 0,
    });
    const [co2Input, setCo2Input] = useState({
        electricity_co2: 0,
        cutton_fibres_co2: 0,
        bleach_co2: 0,
        waste_water_co2: 0,
    });
    const [loaded, setLoaded] = useState(false);
    const notify = () => {
        toast.error("Please upload data to Co2.Storage first!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            className: "toast",
        });
    };
    ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);
    const dispatch = useDispatch();
    const co2_token = useSelector((state) => state.product.co2_token);

    const getAsset = async () => {
        dispatch(changeLoading(true));
        if (co2_token) {
        } else {
            const data = {
                body: {
                    username: props.username,
                },
            };
            const apiData = await API.post("productApi", "/products/getItem", data);
            if (apiData && apiData.co2_token.length !== 0) {
                const token = apiData.co2_token[apiData.co2_token.length - 1];
            } else {
                dispatch(changeLoading(false));
                notify();
            }
            dispatch(changeLoading(false));
        }
    };

    const data = Object.values(co2Input);
    const labels = ["Electricity", "Cutton Fibres", "Bleach", "Waste Water"];
    const chartData = {
        labels,
        datasets: [
            {
                label: "co2 amount",
                data: data,
                backgroundColor: "rgba(54, 162, 235, 0.5)", // 条形图的颜色
                borderColor: "rgba(54, 162, 235, 1)", // 条形图边框的颜色
                borderWidth: 1, // 条形图边框的宽度
            },
        ],
    };
    const pieOptions = {
        // maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "1 Unit of T-Shirt",
                position: "top",
            },
        },
    };
    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true, // Y 轴从 0 开始
                title: {
                    display: true,
                    text: "kg CO2 eq", // Y 轴标题
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Resources", // X 轴标题
                },
            },
        },
    };
    const piechartData = {
        labels,
        datasets: [
            {
                data: data,
                backgroundColor: [
                    "rgba(255,99,132,0.2)",
                    "rgba(54,162,235,0.2)",
                    "rgba(255,206,86,0.2)",
                    "rgba(75,192,192,0.2)",
                ],
                borderColor: ["rgba(255,99,132,1)", "rgba(54,162,235,1)", "rgba(255,206,86,1)", "rgba(75,192,192,1)"],
            },
        ],
    };
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <span>Reports</span>
            <hr style={{ margin: "10px auto" }} />
            {/* <div className="ManagePages-card-right-viewreport">
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title" style={{ width: "4rem" }}>
                        Brand
                    </div>
                    <select name="selectedValue" style={{ width: "10rem" }}>
                        <option value={"Gucci"}>Gucci</option>
                        <option value={"LV"}>LV</option>
                        <option value={"Prada"}>Prada</option>
                        <option value={"Burberry"}>Burberry</option>
                    </select>
                </div>
                <div className="ManagePages-card-right-content">
                    <div
                        className="ManagePages-card-right-content-title"
                        style={{ width: "4rem", marginRight: "1rem" }}
                    >
                        Product
                    </div>
                    <select name="selectedValue" style={{ width: "10rem" }}>
                        <option value={"Gucci"}>Gucci</option>
                        <option value={"LV"}>LV</option>
                        <option value={"Prada"}>Prada</option>
                        <option value={"Burberry"}>Burberry</option>
                    </select>
                </div>
            </div> */}
            <>
                <div>
                    <button className="ManagePages-btn right" onClick={getAsset}>
                        View Reports
                    </button>
                </div>
                <div className="ManagePages-card-right-report">
                    {loaded ? <Bar data={chartData} options={chartOptions} /> : null}
                    {loaded ? (
                        <div>
                            <Doughnut data={piechartData} options={pieOptions} style={{ margin: "auto" }} />
                        </div>
                    ) : null}
                </div>
            </>
        </>
    );
};

export default ViewReports;
