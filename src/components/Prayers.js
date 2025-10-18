

function Prayers({name,time}){


return(

    <div className="salat">
        <p className="prayername"> {name} :</p>
        <p className="prayertime">{time}</p>


    </div>
)
}
export default Prayers;