from django.db import models

class Company(models.Model):
    ticker = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    sector = models.CharField(max_length=100, null=True, blank=True)
    industry = models.CharField(max_length=100, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    employees = models.IntegerField(null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.ticker

class PriceHistoryD1(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="prices_d1")
    date = models.DateTimeField()
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    adj_close = models.FloatField(null=True, blank=True)
    volume = models.BigIntegerField()

    class Meta:
        unique_together = ("company", "date")
        
class PriceHistoryH1(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="prices_h1")
    date = models.DateTimeField()
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    adj_close = models.FloatField(null=True, blank=True)
    volume = models.BigIntegerField()

    class Meta:
        unique_together = ("company", "date")
        
class PriceHistoryM30(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="prices_m30")
    date = models.DateTimeField()
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    adj_close = models.FloatField(null=True, blank=True)
    volume = models.BigIntegerField()

    class Meta:
        unique_together = ("company", "date")
        
class PriceHistoryM15(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="prices_m15")
    date = models.DateTimeField()
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    adj_close = models.FloatField(null=True, blank=True)
    volume = models.BigIntegerField()

    class Meta:
        unique_together = ("company", "date")
        
class PriceHistoryM5(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="prices_m5")
    date = models.DateTimeField()
    open = models.FloatField()
    high = models.FloatField()
    low = models.FloatField()
    close = models.FloatField()
    adj_close = models.FloatField(null=True, blank=True)
    volume = models.BigIntegerField()

    class Meta:
        unique_together = ("company", "date")
