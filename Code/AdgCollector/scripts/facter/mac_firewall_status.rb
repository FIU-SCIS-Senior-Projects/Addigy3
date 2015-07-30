Facter.add(:mac_firewall_status) do
  confine :kernel => "Darwin"
  setcode do
    string = Facter::Util::Resolution.exec("/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate")
    string[12..string.length]
  end
end
