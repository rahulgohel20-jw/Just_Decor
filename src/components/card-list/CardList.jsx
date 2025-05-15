const CardList = ({ leftContent, rightContent }) => {
  return (
    <div className="card overflow-hidden p-5">
      <div className="flex justify-between ">
        <div className="">{leftContent} </div>
        <div className="flex items-center gap-2">{rightContent}</div>
      </div>
    </div>
  );
};
export default CardList;
