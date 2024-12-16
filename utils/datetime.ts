export function calculateTimeLeft(start_date: string) {
  const today = new Date();
  const start = new Date(start_date);
  const timeDiff = start.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const monthsLeft = Math.ceil(daysLeft / 30);
  const yearsLeft = Math.ceil(monthsLeft / 12);

  if (daysLeft > 365) {
    return `${yearsLeft} years left`;
  } else if (daysLeft > 30) {
    return `${monthsLeft} months left`;
  } else {
    return `${daysLeft} days left`;
  }
}

export function formatDate(
  start_date: string,
  end_date: string,
  type: "future" | "past" | "upcoming",
) {
  // if type is future, only show the start_date
  if (type === "future") {
    return new Date(start_date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
  // if start_date and end_date are the same, only show the start_date
  else if (start_date === end_date) {
    return new Date(start_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  // if months are the same, then show month start_day - end_day, year
  else if (new Date(start_date).getMonth() === new Date(end_date).getMonth()) {
    const startDay = new Date(start_date).getDate();
    const endDay = new Date(end_date).getDate();
    const month = new Date(start_date).toLocaleString("en-US", {
      month: "short",
    });
    const year = new Date(start_date).getFullYear();
    return `${month} ${startDay} - ${endDay}, ${year}`;
  }
  // if months are different but year is the same, then show month start_day - month end_day, year
  else if (
    new Date(start_date).getFullYear() === new Date(end_date).getFullYear()
  ) {
    return `${new Date(start_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${new Date(end_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }
  // if year is different, then show month start_day, year - month end_day, year
  else {
    return `${new Date(start_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${new Date(end_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }
}
