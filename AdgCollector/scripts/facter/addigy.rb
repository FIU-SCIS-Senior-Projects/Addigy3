Facter.add(:connectorid) do
  confine :kernel => "Darwin"
  setcode do
      connector = Facter::Util::Resolution.exec("/tmp/curtool connector")
      connector
#      connectorid[12..connectorid.length]
  end
end
#Facter.add(:id) do
#  confine :kernel => "Darwin"
#  setcode do
#      string = Facter::Util::Resolution.exec("/tmp/curtool connector")
#      string[12..string.length]
#  end
#end
#Facter.add(:orgid) do
#  confine :kernel => "Darwin"
#  setcode do
#      string = Facter::Util::Resolution.exec("/tmp/curtool org")
#      string[12..string.length]
#  end
#end
