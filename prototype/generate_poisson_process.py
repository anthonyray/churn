import sys
import csv
import numpy as np
from datetime import datetime
from datetime import timedelta

if len(sys.argv) < 2:
    print "Wrong number of arguments. Exiting ..."
    sys.exit()

num_samples = int(sys.argv[1])

s = np.random.poisson(5,num_samples)
days_intervals = s.tolist()

poisson_timedeltas = [timedelta(days=i) for i in days_intervals]

start_date = "2015-01-01"
format_date = "%Y-%M-%d"

poisson_dates = list()

# Append the first element to the list
poisson_dates.append(datetime.strptime(start_date,format_date))

for i,delta in enumerate(poisson_timedeltas):
    d = poisson_dates[i] + delta
    poisson_dates.append(d)


poisson_dates_string = [date.strftime(format_date) for date in poisson_dates]

csv.register_dialect('commas', delimiter=',')
f = open('dates.csv', 'wb')
from time import time
start = time()
try:
    writer = csv.writer(f,dialect=csv.get_dialect('commas'))
    writer.writerow(('date',))
    for poisson in poisson_dates_string:
        writer.writerow((poisson,))
finally:
    f.close()

print "Done in : " + str(time() - start) + " seconds. Exiting ..."
