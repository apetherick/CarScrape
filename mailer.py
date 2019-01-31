from bs4 import BeautifulSoup
import requests
import smtplib, ssl
import mailconfig as cfg

baseurl = "https://www.u-pull-it.co.uk"
urls = ["https://www.u-pull-it.co.uk/search/catalogue/Breaker-Parts/yard/York/cartype/Vehicles-Under-7.5-Tonnes/make/Volkswagen/model/Golf",
        "https://www.u-pull-it.co.uk/search/catalogue/Breaker-Parts/yard/York/cartype/Vehicles-Under-7.5-Tonnes/make/Volkswagen/model/Bora"]

f=open("./record.lst","rw+")
seen = f.read().split('\n')
print(seen)


new = []

def scrape(url):
   page_response = requests.get(url, timeout=5, verify=False)
   page_content = BeautifulSoup(page_response.content, "html.parser")
   viewButtons = page_content.select("dl.lotInfo + a.viewButton")
   for button in viewButtons:
      if (not button['href'] in seen):
        new.append(button['href'])
        f.write(button['href']+'\n')
   nextButtons = page_content.select("li.pager-next a")
   if len(nextButtons) > 0:
      scrape(baseurl+nextButtons[0]['href'])

for url in urls:
   scrape(url)

if(len(new)>0):
   print(new)
   #Send Mail
   server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
   server.login(cfg.fromEmail, cfg.fromPass)
   server.sendmail(cfg.fromEmail, cfg.toEmail, "New Stock!\n"+"\n".join(new))

