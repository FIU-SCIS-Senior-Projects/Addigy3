# mac_java_version.rb
Facter.add(:sys_cpu_usage) do
  confine :kernel => "Darwin"
  setcode do
    Facter::Util::Resolution.exec("top -l 1 | grep 'CPU usage' | awk '{print $5}' | sed 's/%$//'")
  end
end
